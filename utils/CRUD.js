const APIFeatures = require("./apiFeatures")
const catchAsync = require('./catchAsync');

exports.getAll = Model => catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Model, req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

    const documents = new APIFeatures(Model, req.query).filter()
    const Query = (await documents.query)

    const total_no_of_documents = (Query.length)

    const last_page = Math.ceil(total_no_of_documents / features.metaData().docs_per_page)

    const meta = {...features.metaData(),total_no_of_documents, last_page}
    
    const docs = await features.query;

    res.status(200).json({
        status: 'success',
        results: docs.length,
        data: {
            documents: docs,
            meta 
        }
    })
})

exports.getOne = Model => catchAsync( async (req, res, next) => {
        const doc = await Model.findById(req.params.id).select('-updatedAt');

        if(!doc) return next(new appError(`No document found with that ID,`, 404))
        
        res.status(200).json({
            status: 'success',
            data: {
                document: doc
            }
        })
    })
    
exports.createNew = Model =>  catchAsync( async (req, res, next) => {
    const newDoc = await Model.create(req.body);
    
    res.status(201).json({
        status: 'success',
        data: {
            document: newDoc
        }
    })
})

    exports.updateOne = Model => catchAsync(async (req, res, next) => {
        console.log(req.params.recipeId, req.params.blogId);
        
        console.log(req.body);
        const updatedDoc = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        }).select('-updatedAt')
        
        if(!updatedDoc) return next(new appError(`No document found with that ID,`, 404))
        
        res.status(200).json({
            status: 'success',
            data: {
                document: updatedDoc
            }
        });
    });
    
    exports.deleteOne = Model => catchAsync( async (req, res, next) => {
        const doc = await Model.findByIdAndDelete(req.params.id)
        
        if(!doc) return next(new appError(`No document found with that ID,`, 404))

        res.status(204).json({
            status: 'success',
            message: 'Successfully deleted document'
        })
    })

