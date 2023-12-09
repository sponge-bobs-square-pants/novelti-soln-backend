    const express = require('express')
    const app = express();
    const cors = require('cors');
    require('dotenv').config();
    const connectDB = require('./DB/ConnectDB');
    const User = require('./Models/User');
    const port = process.env.PORT || 5000
    const FormSubmission = require('./Models/FormSubmission')


    app.use(express.json());
    app.use(cors());
    app.options('*', cors());

    app.post('/api/v1/createUser', async (req, res) => {
        const { userId, password, role } = req.body;
        try {
            const existingUser = await User.findOne({ userId });
            if (existingUser) {
                return res.status(400).json({ error: 'User already exists' });
            }

            const newUser = new User({ userId, password, role });
            await newUser.save();

            return res.status(201).json({ user: newUser });
        } catch (error) {
            // console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    });
    app.post('/api/v1/handleFormSubmit', async(req, res) => {
        const {userId, password} = req.body;
        try {
            const user = await User.findOne({userId, password});
            console.log(user);
            if(user){
                return res.status(200).json({user:user.userId, role:user.role})
            }
            else{
                return res.status(401).json({ error: 'Invalid Credentials' });
            }
        } catch (error) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    });
    app.get('/api/v1/GetAllUser', async (req, res) => {
        try {
            const users = await User.find({role:'user'});
            // console.log(users)
            return res.status(200).json({users})
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
            

    });
    app.patch('/api/v1/UpdateUser', async (req, res) => {
        try {
            const Id = req.body.Id;
            const userId = req.body.userId;
            const password = req.body.password;
            const role = req.body.role;
            const updateFields = {};
            if (userId) {
                updateFields.userId = userId;
            }
            if (password) {
                updateFields.password = password;
            }
            if (role) {
                updateFields.role = role;
            }
    
            const updatedUser = await User.findOneAndUpdate(
                {_id: Id},
                {$set:updateFields},
                {new: true}
            );
            return res.status(200).json({updatedUser})
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }  
    });
    app.delete('/api/v1/deleteUser', async(req, res) => {
        const {Id} = req.body
        console.log(req.body);
        try {
            const deletedUser = await User.findOneAndDelete({_id:Id})
            if (!deletedUser) {
                return res.status(404).json({ error: 'User not found' });
            }
            console.log(deletedUser);
            res.status(200).json({ message: 'User deleted successfully', deletedUser });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' }); 
        }
    });
    app.post('/api/v1/SubmitForm', async(req, res) => {
        const formData = req.body
        try {
            const newFormSubmission = new FormSubmission({
                userId: formData.userId,
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                address1: formData.address1,
                address2: formData.address2,
                state: formData.state.map(name => ({ name })),
                country: formData.country.map(name => ({ name })),
                zipCode: formData.zipCode,
            });
            await newFormSubmission.save();

            return res.status(201).json({ message: 'Form submitted successfully!' });
        } catch (error) {
            console.error('Error submitting form:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    });



    const start = async () => {
        try {
            await connectDB(process.env.MONGO_URI)
            app.listen(port, console.log(`Server is listening on port ${port}`))
        } catch (error) {
            console.log(error);
        }
        
    }
    start();