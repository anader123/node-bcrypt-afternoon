const bcrypt = require('bcryptjs'); 


const register = async (req, res) => {
    const db = req.app.get('db'); 
    const { username, password, isAdmin } = req.body; 
    const result = await db.get_user([username]);
    const existingUser = result[0]; 
    if(existingUser) return res.status(409).send('Username taken'); 
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt); 
    const registeredUser = await db.register_user([isAdmin, username, hash]);
    const user = registeredUser[0]; 
    req.session.user = {
        isAdmin: user.is_admin,
        id: user.id,
        username: user.username 
    }
    res.status(201).send(req.session.user); 
}; 

const login = async(req, res) => {
    const { username, password } = req.body;
    const foundUser = await req.app.get('db').get_user([username]);
    const user = foundUser[0];
    if(!user) {
        return res.status(401).send('User not found'); 
    }
    const isAuthenticated = bcrypt.compareSync(password, user.hash); 
    if(!isAuthenticated) {
        return res.status(403).send('Wrong passowrd');
    }
    req.session.user = { isAdmin: user.is_admin, id: user.id, username: user.username };
    return res.send(req.session.user); 
}; 

const logout = (req, res) => {
    req.session.destroy();
    return res.sendStatus(200);
  }

module.exports = {
    register, 
    login, 
    logout
};