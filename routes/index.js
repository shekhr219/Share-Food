const express=require('express')
const router=express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')
const food_items= require('../models/food_item')



// login/Landing page
// route GET/
router.get('/',ensureGuest,(req,res)=>{
    res.render('login',{
        layout:'login',
    })
})


// Dashboard
// route GET/Dashborad
// @desc    Dashboard
// @route   GET /dashboard
router.get('/dashboard', ensureAuth, async (req, res) => {
    try {
      const food_item = await food_items.find({ user: req.user.id }).lean()
      res.render('dashboard', {
        name: req.user.firstName,
        food_item,
      })
    } catch (err) {
      console.error(err)
      res.render('error/500')
    }
  })

module.exports=router
