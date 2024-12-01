const express = require('express');
const connectToDB = require('./connectToDB');
const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const jose = require('jose');
const { createSecretKey } = require('crypto');

const routes = express.Router();
const saltRounds = 6 ;


///////////// user routes
// http://localhost:4000/users
// get all users
routes.route('/users').get( async (req , res) => {
    let db = connectToDB.getDB();
    let users = await db.collection('users').find({}).toArray();
    if(users.length >0){
        res.json(users);
        console.log('test 2 ,success');
    }else {
        console.log('No data here')
    }
});

// http://localhost:4000/user/672b8d7ba86e216e0939816d
// get one user
routes.route('/users/:id').get(verifyToken, async (req , res) => {
    let db = connectToDB.getDB();
    let user = await db.collection('users').findOne({ _id :new ObjectId(req.params.id)});
    // console.log('user : ', !user && user);
    if( user && Object.keys(user).length > 0 ){
        // console.log(!!user);
        res.json(user);
    }else {
        throw new Error('No data found.');
    }

});

// create new user
routes.route('/users').post( async (req, res) => {

    const hash = (await bcrypt.hash(req.body.password,saltRounds)).toString();

    let db = connectToDB.getDB();

    const takenEmail =await db.collection('users').findOne({email : req.body.email});
    if (takenEmail) {
        res.json({message : 'This email is already taken.'});
    } else {

        // mongoObject = new user data
        let mongoObject = {
            name : req.body.name,
            email : req.body.email,
            password : hash,
            role : req.body.role,
            join_date: new Date(),
            appointments : []
        };
        
        let data = await db.collection("users").insertOne(mongoObject);
        if ( data )
        res.json(data);
    }
});

// http://localhost:4000/users/672b8d7ba86e216e0939816d
// update user

routes.route('/users/:id').put(verifyToken, async (req , res) => {

    let db = connectToDB.getDB();
    const updatedData = Object.fromEntries(Object.entries(req.body).filter(e => (e[0] !== 'user' && e[0] !== '_id')));
    // console.log(updatedData);

    // taken email = if the new email is already in use from someone 
    const takenEmail = await db.collection('users').findOne({email : updatedData.email});

    if ( takenEmail && !( new ObjectId(takenEmail._id).equals(new ObjectId(req.body._id)) ) ) {
        // console.log(` 1 : ${takenEmail._id} \n 2 : ${updatedData._id}`)
        res.json({message : 'This email is already taken.'});
    }else {

        // mongoObject = updated data of selected user
        let mongoObject = {
            $set : {
                ...updatedData
            }
        };
        let data = await db.collection("users").updateOne({_id: new ObjectId(req.params.id)}, mongoObject);
        res.json(data);
    };

});

// delete one user
routes.route('/users/:id').delete(verifyToken, async (req, res) => {

    let db = connectToDB.getDB();
    // const userId = req.params.id;
    // console.log('userid: ',userId); 
    let user = await db.collection('users').findOne({ _id :new ObjectId(req.params.id)});
    const role = user.role;
    // console.log('role : ',role);

    let response =await db.collection('users').deleteOne({_id : new ObjectId(req.params.id)});
    // console.log('response : ',response);
    if(response.deletedCount === 0 ){
        res.json({...response,message:'No data deleted. Probably already deleted or not existing.'});
    } else {
        if (role === 'customer'){
            // console.log('testing 44, req.params._id = ',req.params.id);
            const respo = await db.collection('appointments').deleteMany({user_id : new ObjectId(req.params.id)});
            // console.log('respo : ',respo);
        } else if( role === 'provider' ){
            await db.collection('appointments').deleteMany({provider_id : new ObjectId(req.params.id)});
            await db.collection('services').deleteMany({provider_id : new ObjectId(req.params.id)});
        } else {
            return null;
        }
        res.json(response);
    }
});

// user login
routes.route('/users/login').post( async (req, res) => {

    let db = connectToDB.getDB();
    const user = await db.collection('users').findOne({email : req.body.email});

    if (user) {
        let confirmation = await bcrypt.compare(req.body?.password, user?.password);

        if( confirmation ){
            const secretKey = createSecretKey(process.env.SECRET_KEY,'utf-8');
            const token = await new jose.SignJWT(user).setProtectedHeader({alg : 'HS256'}).setIssuedAt()
                .setExpirationTime('12h').sign(secretKey);
            res.json({success : true, token})
        }else {
            res.json({success: false, message: "Incorrect Password"});
        }

    } else {
        res.json({success: false, message: "User not found"});
    }

});

///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
/////////// services routes
// http://localhost:4000/services
// get all services
routes.route('/services').get( async (req , res) => {
    let db = connectToDB.getDB();
    let services = await db.collection('services').find({}).toArray();
    if(services.length >0){
        res.json(services);
        console.log('success');
    }else {
        console.log('No data here')
    }
});

// http://localhost:4000/service/672b8f4fa86e216e09398174
// get one service
routes.route('/services/:id').get( async (req , res) => {
    let db = connectToDB.getDB();
    let service = await db.collection('services').findOne({ _id :new ObjectId(req.params.id)});

    if( Object.keys(service).length > 0 ){
        // console.log(service);
        res.json(service);
    }else {
        throw new Error('No data found.');
    }

});

// create new service
routes.route('/services').post(verifyToken, async (req, res) => {

    let db = connectToDB.getDB();

    let mongoObject = {
        title: req.body.title,
        description: req.body.description,
        provider_id: new ObjectId(req.body.provider_id),
        provider_name: req.body.provider_name,
        provider_specialty: req.body.provider_specialty
    };

    let data = await db.collection("services").insertOne(mongoObject);
    if ( data )
    res.json(data);
});

// http://localhost:4000/services/672b8d7ba86e216e0939816d
// update service

routes.route('/services/:id').put(verifyToken, async (req , res) => {

    let db = connectToDB.getDB();

    let mongoObject = {
        $set : {
            title: req.body.title,
            description: req.body.description,

        }
    }

    let data = await db.collection("services").updateOne({_id: new ObjectId(req.params.id)}, mongoObject)
    res.json(data)
});

// delete one service
routes.route('/services/:id').delete(verifyToken, async (req, res) => {

    let db = connectToDB.getDB();
    let data = db.collection('services').deleteOne({_id : new ObjectId(req.params.id)});
    res.json(data);
});


///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
/////////// appointments routes
// http://localhost:4000/appointments
// get all appointments
routes.route('/appointments').get(verifyToken, async (req , res) => {
    let db = connectToDB.getDB();
    let appointments = await db.collection('appointments').find({}).toArray();
    if(appointments.length >0){
        res.json(appointments);
        console.log('test success');
    }else {
        console.log('No data here')
    }
});

// http://localhost:4000/appointments/672b8efca86e216e09398172
// get one appointment
routes.route('/appointments/:id').get(verifyToken, async (req , res) => {
    let db = connectToDB.getDB();
    let appointment = await db.collection('appointments').findOne({ _id :new ObjectId(req.params.id)});

    if( Object.keys(appointment).length > 0 ){
        // console.log(appointment);
        res.json(appointment);
    }else {
        throw new Error('No data found.');
    }

});

// create new appointment
routes.route('/appointments').post(verifyToken, async (req, res) => {

    let db = connectToDB.getDB();

    let mongoObject = {
        user_id: new ObjectId(req.body.user_id),
        provider_id: new ObjectId(req.body.provider_id),
        service_id : new ObjectId(req.body.service_id),
        date: req.body.date,
        time: req.body.time,
        status: req.body.status
    };

    let data = await db.collection("appointments").insertOne(mongoObject);
    if ( data )
    res.json(data);
});

// http://localhost:4000/appointments/672b8efca86e216e09398172
// update appointment

routes.route('/appointments/:id').put(verifyToken, async (req , res) => {

    let db = connectToDB.getDB();

    let mongoObject = {
        $set : {
            title: req.body.title,
            description: req.body.description,
            provider_id: req.body.user._id
        }
    }

    let data = await db.collection("appointments").updateOne({_id: new ObjectId(req.params.id)}, mongoObject)
    res.json(data)
});

// delete one appointment
routes.route('/appointments/:id').delete(verifyToken, async (req, res) => {

    let db = connectToDB.getDB();
    let data = db.collection('appointments').deleteOne({_id : new ObjectId(req.params.id)});
    res.json(data);
});

async function verifyToken(request, response, next) {
    const authHeaders = await request.headers["authorization"];
    // console.log('auth Headers => ',authHeaders);
    const token = authHeaders && authHeaders.split(' ')[1];
    if (!token) {
        return response.status(401).json({message: "Authentication token is missing"});
    };

    const verifiedJWT = await jose.jwtVerify(token, new TextEncoder().encode(process.env.SECRET_KEY));

    if (!verifiedJWT) {
        return response.status(403).json({message: "Invalid Token"});
    };

    request.body.user = verifiedJWT.payload;
    next();
};

module.exports = routes;
