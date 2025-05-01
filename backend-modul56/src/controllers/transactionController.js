const pool = require('../database/pg-database');

const createTransaction = async (req, res) => {
    const { item_id, quantity, user_id } = req.body;
    try {
        const itemresult = await pool.query('SELECT * FROM items WHERE id = $1', [item_id]);
        if (itemresult.rows.length === 0) {
            return res.status(404).json({
            success: false,
            message: 'Item not found',
            payload: null,
            });
        }
        if (quantity <= 0){
            return res.status(400).json({
            success: false,
            message: 'quantity must be larger than 0',
            payload: null,
            });
        }
        const result = await pool.query(
            'INSERT INTO transactions (user_id, item_id, quantity, total, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [user_id, item_id, quantity, itemresult.rows[0].price * quantity, 'pending']
        );
        res.status(201).json({
        success: true,
        message: 'Transaction created',
        payload: result.rows[0],
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
        success: false,
        message: 'Internal server error',
        payload: null,
        });
    }
}

const payTransaction = async (req, res) => {
    const id = req.params.id;
    try {
        const transactionresult = await pool.query('SELECT * FROM transactions WHERE id = $1', [id]);
        if (transactionresult.rows.length === 0) {
            return res.status(404).json({
            success: false,
            message: 'Transaction not found',
            payload: null,
            });
        }
        if (transactionresult.rows[0].status == 'paid'){
            return res.status(400).json({
            success: false,
            message: 'Transaction already paid',
            payload: null,
            });
        }
        const userresult = await pool.query('SELECT * FROM users WHERE id = $1', [transactionresult.rows[0].user_id]);
        if (userresult.rows[0].balance < transactionresult.rows[0].total){
            return res.status(400).json({
            success: false,
            message: 'Failed to pay',
            payload: null,
            });
        }
        const transactionedited = await pool.query('UPDATE transactions SET status = $1 WHERE id = $2 RETURNING *', ['paid', id]);
        await pool.query('UPDATE users SET balance = $1 WHERE id = $2 RETURNING *', [userresult.rows[0].balance - transactionresult.rows[0].total, transactionresult.rows[0].user_id]);
        await pool.query('UPDATE items SET stock = $1 WHERE id = $2 RETURNING *', [transactionresult.rows[0].quantity, transactionresult.rows[0].item_id]);
        return res.status (200).json({
            success: true,
            message: 'Transaction paid',
            payload: transactionedited.rows[0],
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
        success: false,
        message: 'Internal server error',
        payload: null,
        });
    }
}

const deleteTransaction = async (req, res) => {
    const id = req.params.id;
    try {
        console.log(id);
        const deletedresult = await pool.query('SELECT * FROM transactions WHERE id = $1', [id]);
        await pool.query('DELETE FROM transactions WHERE id = $1', [id]);
        if (deletedresult.rows.length === 0) {
            return res.status(404).json({
            success: false,
            message: 'Transaction not found',
            payload: null,
            });
        }
        res.status(200).json({
            success: true,
            message: 'Transaction deleted',
            payload: deletedresult.rows[0],
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
        success: false,
        message: 'Internal server error',
        payload: null,
        });
    }
}

const getAllTransactions = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM transactions ORDER BY created_at DESC');
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No transactions found',
                payload: null,
            });
        }
        res.status(200).json({
            success: true,
            message: 'Transactions found',
            payload: result.rows,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            payload: null,
        });
    }
};

const getTransactionsByUserId = async (req, res) => {
    const userId = req.params.userId; // Get userId from route parameters

    // Validate if userId is provided
    if (!userId) {
        return res.status(400).json({
            success: false,
            message: 'User ID is required.',
            payload: null,
        });
    }

    try {
        const result = await pool.query(
            'SELECT * FROM transactions WHERE user_id = $1 ORDER BY created_at DESC',
            [userId]
        );

        // It's okay if a user has no transactions, return success with empty array
        res.status(200).json({
            success: true,
            message: result.rows.length > 0 ? 'Transactions found' : 'No transactions found for this user',
            payload: result.rows, // Send empty array if no transactions
        });

    } catch (error) {
        console.error('Error fetching transactions by user ID:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while fetching transactions.',
            payload: null,
        });
    }
};


module.exports = {
  createTransaction,
  payTransaction,
  deleteTransaction,
  getAllTransactions,
  getTransactionsByUserId
};