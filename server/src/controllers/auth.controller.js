export function registerUser(req, res) {
  // Registration logic here
  const {email, fullName, password} = req.body;
  try {
    if (!email || !fullName || !password) {
      return res.status(400).json({message: 'All fields are required'});
    }
  } catch (error) { 
    return res.status(500).json({message: 'Server error'});
    
  }
  res.send('User registered');
}
export function loginUser(req, res) {
  // Login logic here
  res.send('User logged in');
}
export function logoutUser(req, res){
    res.send('User logged out');
}