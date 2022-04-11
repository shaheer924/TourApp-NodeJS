const fs = require('fs');


const user = fs.readFileSync(`../dev-data/users.json`);
const users = JSON.parse(user);

exports.getAllUsers = (req, res) => {
    res.status(200).json({
        Status: 'Success',
        results: users.length,
        data: { users }
    });
}

exports.postUser = (req, res) => {
    console.log(req.body)
    const newId = users[users.length - 1]['_id'] + 1;
    const newData = Object.assign({ id: newId }, req.body);
    users.push(newData);
    fs.writeFile('../dev-data/users.json', JSON.stringify(users), err = () => {
        res.status(201).send("Done");
    });
}
exports.getUser = (req, res) => {
    console.log(req.params);
    const searchId = req.params.id * 1;

    //approach 1
    if (searchId > users.length) {
        return res.json({
            status: 404,
            message: 'Invalid ID'
        })
    }
    console.log(searchId);
    const Searcheduser = users.find(el => el._id == searchId);
    //approach 2
    if (!Searcheduser) {
        return res.json({
            status: 404,
            message: 'Invalid ID'
        })
    }
    res.status(200).json({
        status: 'Success',
        data: { Searcheduser }
    })
}

exports.updateUser = (req, res) => {
    const update_Id = req.params.id * 1;
    const update_Data = users.find(el => el._id === update_Id);

    if (!update_Data) {
        res.json({
            Status: 'Not Found',
            message: 'Data Not Found'
        })
    }

    update_Data.duration = req.body.duration;
    console.log(update_Data);
    res.status(200).json({
        status: "Success",
        data: {
            update_Data
        }
    })
}

exports.deleteUser = (req, res) => {
    const del_id = req.params.id * 1;
    for (var i = 0; i < users.length; i++) {
        if (del_id === users[i]['id']) {
            delete users[i]
        }
    }
    res.json({
        status: 'success',
        results: users.length,
        data: { users }
    });
}
