const Order = require('../models/order');
const Product = require('../models/product');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

// Create a new order =>

exports.newOrder = catchAsyncErrors(async(req,res,next)=>{
    const{
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo
    } = req.body;

    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt: Date.now(),
        user: req.user._id
    })

    res.status(200).json({
        success: true,
        order
    })


})
// Get single order =>
exports.getSingleOrder = catchAsyncErrors(async(req, res, next) =>{
    const order = await Order.findById(req.params.id).populate('user', 'name email')

    if(!order){
        return next(new ErrorHandler('No Order found with this ID', 404))
    }
    res.status(200).json({
        success: true,
        order
    })
})
// Get logged in user order =>
    exports.myOrders = catchAsyncErrors(async(req, res, next) =>{
        const orders = await Order.find({user: req.user.id})
    
        res.status(200).json({
            success: true,
            orders
        })
    })

// Get all orders - ADMIN =>
    exports.allOrders = catchAsyncErrors(async(req, res, next) =>{
        const orders = await Order.find()

        let totalAmount = 0;
        orders.forEach(order => {
            totalAmount += order.totalPrice
        })
    
        res.status(200).json({
            success: true,
            totalAmount,
            orders

        })
    })

// Update / Process order - ADMIN =>
    exports.updateOrder = catchAsyncErrors(async(req, res, next) =>{
        const order = await Order.findById(req.params.id)
    if(order.orderStatus === 'Delivered'){
        return next(new ErrorHandler('You have already delivered this order',400))
    }
       

    order.orderStatus = req.body.status,
    order.deliveredAt = Date,now()

    await order.save()

    res.status(200).json({
        success: true,
        
    })
})

// Delete order order =>
    exports.deleteOrder = catchAsyncErrors(async(req, res, next) =>{
        const order = await Order.findById(req.params.id)
    
        if(!order){
            return next(new ErrorHandler('No Order found with this ID', 404))
        }
        await order.deleteOne()
        res.status(200).json({
            success: true
        })
    })
