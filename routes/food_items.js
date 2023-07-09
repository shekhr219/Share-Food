const express=require('express')
const router=express.Router()
const { ensureAuth } = require('../middleware/auth')
const food_items= require('../models/food_item')



// Show add page
// GET/food_items/add
router.get('/add',ensureAuth,(req,res)=>{
    res.render('food_items/add')
})

// Process add page
// POST/food_items
router.post('/',ensureAuth, async (req,res)=>{
   try {
    req.body.user = req.user.id
      await food_items.create(req.body)
      res.redirect('/dashboard')
   } catch (err) {
    console.error(err)
    res.render('error/500')
   }
    
})

// @desc    Show all food_items
// @route   GET /food_items
router.get('/', ensureAuth, async (req, res) => {
   try {
     const food_item= await food_items.find({ status: 'other' })
     .populate ([ { path: 'user', strictPopulate: false }])
       .sort({ createdAt: 'desc' })
       .lean()
 
     res.render('food_items/index', {
       food_item,
     })
   } catch (err) {
     console.error(err)
     res.render('error/500')
   }
 })

// @desc    Show single story
// @route   GET /stories/:id
router.get('/:id', ensureAuth, async (req, res) => {
  try {
    let food_item = await food_items.findById(req.params.id).populate('user').lean()

    if (!food_item) {
      return res.render('error/404')
    }

    if (food_item.user._id != req.user.id && food_item.status == 'mine') {
      res.render('error/404')
    } else {
      res.render('food_items/show', {
        food_item,
      })
    }
  } catch (err) {
    console.error(err)
    res.render('error/404')
  }
})


 

 // Show edit page
// GET/food_items/edit/:id
router.get('/edit/:id',ensureAuth,async (req,res)=>{
  const food_item=await food_items.findOne({
    _id:req.params.id
  }).lean()
  if(!food_item){
    return res.render('error/404')
  }
  if(food_item.user!=req.user.id){
    res.redirect('/food_items')
  } else{
    res.render('food_items/edit',{
      food_item,
    })
  }
})



// Update page
// PUT/food_items/:id
router.put('/:id',ensureAuth,async (req,res)=>{
  try{
  let food_item=await food_items.findById(req.params.id).lean()
  if(!food_item){
    return res.render('error/404')
  }
  if(food_item.user!=req.user.id){
    res.redirect('/food_items')
  } else{
    story = await food_items.findOneAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
      runValidators: true,
    })
    res.redirect('/dashboard')
  }}catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})



// @desc    Delete story
// @route   DELETE /stories/:id
router.delete('/:id', ensureAuth, async (req, res) => {
  try {
    let food_item = await food_items.findById(req.params.id).lean()

    if (!food_item) {
      return res.render('error/404')
    }

    if (food_item.user != req.user.id) {
      res.redirect('/food_items')
    } else {
      await food_items.remove({ _id: req.params.id })
      res.redirect('/dashboard')
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})


// @desc    User stories
// @route   GET /stories/user/:userId
router.get('/user/:userId', ensureAuth, async (req, res) => {
  try {
    const food_item = await food_items.find({
      user: req.params.userId,
      status: 'other',
    })
      .populate('user')
      .lean()

    res.render('food_items/index', {
      food_item,
    })
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})



//@desc Search food_items by title
//@route GET /food_items/search/:query
router.get('/search/:query', ensureAuth, async (req, res) => {
  try{
      const food_item = await food_items.find({foodName: new RegExp(req.query.query,'i'), status: 'other'})
      .populate('user')
      .sort({ createdAt: 'desc'})
      .lean()
     res.render('food_items/index', { food_item })
  } catch(err){
      console.log(err)
      res.render('error/404')
  }
})



module.exports=router
