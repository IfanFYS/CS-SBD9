const pool = require('../database/pg-database');
const bcrypt = require("bcrypt");
const saltRounds = 10;

const registerUser = async (req, res) => {
  try {
    console.log('==== REGISTER REQUEST RECEIVED ====');
    console.log('Full request body:', req.body);
    
    // Extract and log user data
    const { name, email, password, balance } = req.body;
    console.log(`Name: "${name}", Email: "${email}", Password length: ${password?.length}`);
    
    // Skip validation completely for debugging
    const hashedPassword = await bcrypt.hash(password || '', saltRounds);
    console.log('Password hashed successfully');
    
    // Insert the user with default balance 0 if no balance provided
    const finalBalance = balance || 0;
    
    console.log('Attempting database insert with:', { name, email, passwordHash: '***', finalBalance });
    
    // Try to insert the user
    const result = await pool.query(
      'INSERT INTO users (name, email, password, balance) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, hashedPassword, finalBalance]
    );
    
    console.log('Database insert successful');
    
    // Return success response
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      payload: {
        id: result.rows[0].id,
        name: result.rows[0].name,
        email: result.rows[0].email
      }
    });
  } catch (error) {
    console.error('==== REGISTRATION ERROR ====');
    console.error(error);
    
    // Check for duplicate key violation (email already exists)
    if (error.code === '23505') {  // PostgreSQL unique constraint violation code
      return res.status(409).json({
        success: false,
        message: 'Email already registered',
        payload: null
      });
    }
    
    // Return a general error for all other issues
    return res.status(500).json({
      success: false,
      message: 'Registration failed: ' + error.message,
      payload: null
    });
  }
};

const loginUser = async (req, res) => {
  try {
    console.log('==== LOGIN REQUEST RECEIVED ====');
    console.log('Login attempt with:', req.body);
    
    const { email, password } = req.body;
    
    // Check if user exists
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    
    // If no user found with this email
    if (result.rows.length === 0) {
      console.log(`No user found with email: ${email}`);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        payload: null,
      });
    }
    
    // User found, now verify password
    const user = result.rows[0];
    console.log(`User found: ${user.name}, now comparing passwords`);
    
    // Use bcrypt to compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      console.log('Password comparison failed');
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        payload: null,
      });
    }
    
    // Success - password matched
    console.log('Login successful');
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      payload: {
        id: user.id,
        name: user.name,
        email: user.email,
        balance: user.balance
      },
    });
  } catch (error) {
    console.error('==== LOGIN ERROR ====');
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Login failed: ' + error.message,
      payload: null,
    });
  }
};

const getUserByEmail = async (req, res) => {
  const { email } = req.params;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if(result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        payload: null,
      });
    }
    res.status(200).json({
      success: true,
      message: 'User found',
      payload: result.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message:'Server Error',
      payload: null,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    console.log('==== UPDATE USER REQUEST RECEIVED ====');
    console.log('Update data received:', { ...req.body, password: req.body.password ? '******' : undefined });
    
    const { id, email, password, name } = req.body;
    
    // Validate required fields
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
        payload: null,
      });
    }
    
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required',
        payload: null,
      });
    }
    
    // Simple email validation
    const isValidEmail = email && typeof email === 'string' && email.includes('@');
    if (!isValidEmail) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format',
        payload: null,
      });
    }
    
    // Different logic based on whether a password was provided
    if (password && password.trim() !== '') {
      console.log('Password provided, validating and updating with new password');
      
      // Password validation only if password is provided
      const hasNumber = /\d/.test(password);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
      const isLongEnough = password && password.length >= 8;
      const isValidPassword = hasNumber && hasSpecialChar && isLongEnough;
      
      if (!isValidPassword) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 8 characters long and contain at least one number and one special character',
          payload: null,
        });
      }
      
      // If password is valid, hash it and update user
      try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const updatedUser = await pool.query(
          'UPDATE users SET name = $1, password = $2, email = $3 WHERE id = $4 RETURNING *',
          [name, hashedPassword, email, id]
        );
        
        if (updatedUser.rows.length === 0) {
          return res.status(404).json({
            success: false,
            message: 'User not found',
            payload: null,
          });
        }
        
        return res.status(200).json({
          success: true,
          message: 'User updated successfully',
          payload: {
            id: updatedUser.rows[0].id,
            name: updatedUser.rows[0].name,
            email: updatedUser.rows[0].email,
            balance: updatedUser.rows[0].balance
          },
        });
      } catch (error) {
        console.error('Error updating user with password:', error);
        return res.status(500).json({
          success: false,
          message: 'Server Error during user update',
          payload: null,
        });
      }
    } else {
      // If no password provided, only update name and email
      console.log('No password provided, updating only name and email');
      try {
        const updatedUser = await pool.query(
          'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *',
          [name, email, id]
        );
        
        if (updatedUser.rows.length === 0) {
          return res.status(404).json({
            success: false,
            message: 'User not found',
            payload: null,
          });
        }
        
        return res.status(200).json({
          success: true,
          message: 'User updated successfully',
          payload: {
            id: updatedUser.rows[0].id,
            name: updatedUser.rows[0].name,
            email: updatedUser.rows[0].email,
            balance: updatedUser.rows[0].balance
          },
        });
      } catch (error) {
        console.error('Error updating user without password:', error);
        return res.status(500).json({
          success: false,
          message: 'Server Error during user update',
          payload: null,
        });
      }
    }
  } catch (error) {
    console.error('Unexpected error in updateUser:', error);
    return res.status(500).json({
      success: false,
      message: 'Server Error',
      payload: null,
    });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        payload: null,
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted',
      payload: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      payload: null,
    });
  }
};

const topUp = async (req, res) => {
  const { id, amount } = req.query;

  try {
    if(amount <= 0) {
      return res.status(404).json({
        success: false,
        message: 'Amount must be larger than 0',
        payload: null,
      });
    }
    const result = await pool.query(
      'UPDATE users SET balance = balance + $1 WHERE id = $2 RETURNING *',
      [amount, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        payload: null,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Top up successful',
      payload: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      payload: null,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, balance, created_at FROM users ORDER BY id ASC'); // Exclude password for security
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No users found',
        payload: null,
      });
    }
    res.status(200).json({
      success: true,
      message: 'Users found',
      payload: result.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      payload: null,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserByEmail,
  updateUser,
  deleteUser,
  topUp,
  getAllUsers // Export the new function
};