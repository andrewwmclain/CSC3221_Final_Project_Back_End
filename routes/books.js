// For the routes
let express = require('express');
let router = express.Router();
// For the Data Model
let BookSchema = require('../models/books');


function HandleError(response, reason, message, code){
    console.log('ERROR: ' + reason);
    response.status(code || 500).json({"error:": message});
}

    // Name: String,
    // Author: String,
    // ISBN: String,
    // Price: Double


router.post('/', (request, response, next) => {
    let newBook = request.body;
    console.log(request.body);
    if (!newBook.Name || !newBook.Author || !newBook.ISBN || !newBook.Price){
        HandleError(response, 'Missing Info', 'Form data missing', 500);
    }else{
        let book = new BookSchema({
            Name: newBook.Name,
            Author: newBook.Author,
            ISBN: newBook.ISBN,
            Price: newBook.Price
        });
        book.save((error) => {
            if (error){
                response.send({"error": error});
            }else{
                response.send({"id": book.id});
            }
        });
    }
});

router.get('/', (request, response, next) => {
    let name = request.query['name'];
    if (name){
        BookSchema
            .find({"Name": name})
            .exec( (error, books) => {
                if (error){
                    response.send({"error": error});
                }else{
                    response.send(books);
                }
            });
    }else{
        BookSchema
            .find()
            .exec( (error, books) => {
                if (error){
                    response.send({"error": error});
                }else{
                    response.send(books);
                }
            });
    }
} );

router.get('/:id', (request, response, next) =>{
    BookSchema
        .findOne({"_id": request.params.id}, (error, result) =>{
            if (error) {
                response.status(500).send(error);
            }
            if (result){
                response.send(result);
            }else{
                response.status(404).send({"id": request.params.id, "error":  "Not Found"});
            }

        });
});

router.patch('/:id', (request, response, next) =>{
    BookSchema
        .findById(request.params.id, (error, result)=>{
            if (error) {
                response.status(500).send(error);
            }else if (result){
                if (request.body._id){
                    delete request.body._id;
                }
                for (let field in request.body){
                    result[field] = request.body[field];
                }
                result.save((error, friend)=>{
                    if (error){
                        response.status(500).send(error);
                    }
                    response.send(friend);
                });
            }else{
                response.status(404).send({"id": request.params.id, "error":  "Not Found"});
            }

        });
});

router.delete('/:id', (request, response, next) =>{
    BookSchema
        .findById(request.params.id, (error, result)=>{
            if (error) {
                response.status(500).send(error);
            }else if (result){
                result.remove((error)=>{
                    if (error){
                        response.status(500).send(error);
                    }
                    response.send({"deletedId": request.params.id});
                });
            }else{
                response.status(404).send({"id": request.params.id, "error":  "Not Found"});
            }
        });
});


module.exports = router;