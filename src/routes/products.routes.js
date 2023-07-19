import { Router } from 'express'
import ProductManager from '../dao/productsManager.js'

const productService = new ProductManager("products.json")


//middlewear
const validateCamps = (req, res, next) =>{
    const productInfo = req.body
    if(!productInfo.title || !productInfo.description || !productInfo.code || !productInfo.price || !productInfo.status || !productInfo.stock || !productInfo.category){
        return res.json({status: "error", message: "Faltan completar campos"})
    }
    else{
        next()
    }
}


const router = Router()



//Get products
router.get("/", async(req, res) =>{
    try {
        let limit = parseInt(req.query.limit)
        const product = await productService.getProducts()
        if(limit > 0){
            const result = product.filter(pro => pro.id <= limit)
            res.json({status:"success", data: result})
        }
        else{
            res.json({status:"success", data: product})
        }
    }
    catch (error) {
        res.json({status: "error", message: error.message})
    }
})



//Get products by ID
router.get("/:pid", async(req, res) =>{
    try {
        let pid = parseInt(req.params.pid)
        let productId = await productService.getProductById(pid)

        if(!productId){
            res.json({status:"error", message: "Not exist product with that ID"})
        }
        else{
            res.json({status: "success", data: productId})
        }
    }
    catch (error) {
        res.json({status:"error", message: error.message})
    }
})



//Post products
router.post("/", validateCamps, async(req, res) =>{
    try {
        const productInfo = req.body
        const productCreated = await productService.addProduct(productInfo)
        res.json({status:"success", data: productCreated, message:"Created product"})
    }
    catch (error) {
        res.json({status: "error", message: error.message})
    }
})



//Update products by ID
router.put("/:pid", validateCamps, async(req, res) =>{
    try {
        let pid = parseInt(req.params.pid)
        let product = req.body
        let productUpdate = await productService.updateProduct(pid, product)

        if(!productUpdate){
            res.json({status:"error", message: "Not exist product with that ID"})
        }
        else{
            res.json({status: "success", data: productUpdate})
        }
    }
    catch (error) {
        res.json({status:"error", message: error.message})
    }
})



//Delete products by ID
router.delete("/:pid", async(req, res) =>{
    try {
        let pid = parseInt(req.params.pid)
        let deleteProduct = await productService.deleteProduct(pid)

        if(!deleteProduct){
            res.json({status:"error", message: "Not exist product with that ID"})
        }
        else{
            res.json({status: "success", data: deleteProduct})
        }
    }
    catch (error) {
        res.json({status:"error", message: error.message})
    }
})


export { router as productsRouter }