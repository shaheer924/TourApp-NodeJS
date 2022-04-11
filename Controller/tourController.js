const { Console } = require('console');
const { query } = require('express');
const fs = require('fs');
const Tours = require('../models/TourModel');

// const tour = fs.readFileSync(`../dev-data/tours-simple.json`)
// const tours = JSON.parse(tour);


// exports.CheckID = (req, res, next, val) => {
//     console.log(val)
//     if (req.params.id > tours.length) {
//         return res.status(404).json({
//             status: "Fail",
//             message: 'Invalid ID'
//         })
//     }
//     next()
// }
// exports.CheckBody = (req, res, next) => {
//     const dat = req.body
//     console.log(req.body['price'])
//     if(!req.body['name'] || !req.body['price']){
//         return res.status(404).json({
//             status: "Fail",
//             message: 'Invalid Entry'
//         })
//     }
//     else{
//         res.status(200).json({
//             status: "OK",
//             message: 'OK Data',
//             data : {
//                 dat
//             }
//         })
//     }
// }
exports.CheapTours = (req,res,next)=>{
    req.query.limit = 5;
    req.query.sort = '-price,ratingsAverage';
    req.query.fields = 'price,ratingsAverage,name,difficulty,summary,duration';
    next();
}
exports.getAllTours = async (req, res) => {
    try{


        const QueryObj = {...req.query};
        //excluding the fields from query
        const excludeFields = ['page','sort','limit','fields'];
        excludeFields.forEach(ex => delete QueryObj[ex]);

        //adding $ to alter the query/ Advanced Filtering
        queryStr = JSON.stringify(QueryObj);
        // console.log(queryStr)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g,matchStr => `$${matchStr}`);

        console.log(JSON.parse(queryStr));
        queryStr = JSON.parse(queryStr);
        let query = Tours.find(queryStr);

        //sorting 
        console.log(req.query.sort);
        if(req.query.sort==true){
            const sortby = req.query.sort.split(',').join(' ');
            console.log(req.query.sort.split(','));
            query = query.sort(req.query.sort)
        }
        
        //selecting fields
        if(req.query.fields){
            const fields = req.query.fields.split(',').join(' ');
            console.log(fields);
            query = query.select(fields);
        }
        else{
            query = query.select('-__V')
        }

        //pagination
        page = req.query.page * 1;
        limit = req.query.limit*1;
        skip = (page-1)*limit;
        
        query = query.skip(skip).limit(limit);

        const tours = await query;
        res.json({
            Status: 200,
            Result: tours.length,
            data: {
                tours
            }
        });
    }catch(err){
        console.error(err);
    }
    
}

exports.postTour = async (req, res) => {
    // console.log(req.body)
    // const newId = tours[tours.length - 1].id + 1;
    // const newData = Object.assign({ id: newId }, req.body);
    // tours.push(newData);
    // fs.writeFile('../dev-data/tours-simple.json', JSON.stringify(tours), err = () => {
    //     res.status(201).send("Done");
    // });
    try{
        const data = await Tours.create(JSON.parse(req.body));
        res.json({
            Status: 'success',
            Result: {
                data
            }
        });
    }
    catch(err) {
        console.error(err);
    }
}
exports.getTour = async (req, res) => {
    // console.log(req.params);
    // const searchId = req.params.id * 1;
    // console.log(searchId);
    // const Searchedtour = tours.find(el => el.id == searchId);
    // // //approach 2
    // // if (!Searchedtour) {
    // //     return res.json({
    // //         status: 404,
    // //         message: 'Invalid ID'
    // //     })
    // // }
    // res.status(200).json({
    //     status: 'Success',
    //     data: { Searchedtour }
    // })
    try{
        const data = await Tours.findById(req.params.id);
        // const data = await Tours.findOne({_id:req.params.id})
        res.json({
            Status: 'success',
            Result: {data}
        })
    }
    catch(err){
        console.log(err);
    }
}

exports.updateTour = async (req, res) => {
    // const update_Id = req.params.id * 1;
    // const update_Data = tours.find(el => el.id === update_Id);

    // // if (!update_Data) {
    // //     res.json({
    // //         Status: 'Not Found',
    // //         message: 'Data Not Found'
    // //     })
    // // }

    // update_Data.duration = req.body.duration;
    // console.log(update_Data);
    // res.status(200).json({
    //     status: "Success",
    //     data: {
    //         update_Data
    //     }
    // })
    try{
        const data = await Tours.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.json({
            status: "Success",
            Result: { data }
        })
    }
    catch(err){
        console.log(err);
    }
}

exports.deleteTour = async (req, res) => {
    // const del_id = req.params.id * 1;
    // for (var i = 0; i < tours.length; i++) {
    //     if (del_id === tours[i]['id']) {
    //         delete tours[i]
    //     }
    // }
    // res.json({
    //     status: 'success',
    //     results: tours.length,
    //     data: { tours }
    // });
    try{
        const data =await Tours.findOneAndDelete({ _id: req.params.id})
        res.json({ 
            Status: 'success',
            Result: {data}
        })
    }
    catch(e){
        console.log(e);
    }
}

exports.getTourStats = async (req, res) => {
    try{

        const stats = await Tours.aggregate([
            {
                $match: { ratingsAverage: {$gte: 4.5}}
            },
            {
                $group: {
                    _id: '$difficulty',
                    numTours: {$sum: 1},
                    numRatings: {$sum: '$ratingsQuantity'},
                    AvgPrice: {$avg: '$price'},
                    AvgRating: {$avg: '$ratingsAverage'},
                    minPrice: {$min: '$price'},
                    maxPrice: {$max: '$price'}
                }
            },
            {
                $sort: {AvgPrice: 1},
            }
        ]);
        res.json({
            Status: 'success',
            Result: {stats}
        })
    }
    catch(err){
        console.log(err);
    }
}

exports.getMonthlyPlan = async (req, res) =>{
    try{
        const year = req.params.year*1
        const plan = await Tours.aggregate([
            {
                $unwind: '$startDates'
            },
            {
                $match:
                {
                    startDates:{
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`)
                    }
                    
                }
            },
            {
                $group: {
                    _id: {$month: '$startDates'},
                    numTourStarts: {$sum: 1}
                }
            }
        ])
        res.json({
            Status: 'success',
            Result: {plan}
        })

    }
    catch(err){
        console.log(err);
    }
}