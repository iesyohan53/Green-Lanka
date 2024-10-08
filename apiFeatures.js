class APIFeatures {
    constructor( query, queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }
    search(){
        const keyword = this.queryStr.keyword ?{
           product_name:{
                $regex: this.queryStr.keyword,
                $options:'i'
           }
        }:{}
        console.log(keyword);

        this.query = this.query.find({...keyword});
        return this;
    }
    filter(){
        const queryCopy = { ...this.queryStr};

        // removing fields from the qury
        const removeFields = ['keyword','limit','page'] 
        removeFields.forEach(el => delete queryCopy[el]);


        // advance filter for price, ratings etc
        let queryStr = JSON.stringify(queryCopy)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g,match => `$${match}`)
      
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
        
    }
    pagination(resPerPage){
        const currentPage = Number(this.queryStr.page) ||1;
        const skip = resPerPage * (currentPage -1);

        this.query = this.query.limit(resPerPage).skip(skip);
        return this;
    }


}
module.exports = APIFeatures; 