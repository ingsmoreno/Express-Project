class ApiFeatures {
    constructor(queryMongo, requestQuery) {
        this.queryMongo = queryMongo;
        this.requestQuery = requestQuery;
    }

    filter(){
        const queryObj = {...this.requestQuery};
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        
        excludedFields.forEach(el => delete queryObj[el])
        const queryStr = JSON.stringify(queryObj).replace(/\b(gte|gt|lt|lte)\b/g, match => `$${match}`);
        this.queryMongo = this.queryMongo.find( JSON.parse(queryStr) );

        return this;
    };

    sort(){
        if(this.requestQuery.sort){
            const sortBy = this.requestQuery.sort.split(',').join(' ')
            this.queryMongo = this.queryMongo.sort(sortBy);
        }

        return this;

    }

    limit(){
        if(this.requestQuery.fields){

            const fields = this.requestQuery.fields.split(',').join(' ')
            this.queryMongo = this.queryMongo.select(fields)

        } else {
            this.queryMongo = this.queryMongo.select('-__v')
        }

        return this;
    }

    paginate(){
        const page = this.requestQuery.page * 1 || 1;
        const limit = this.requestQuery.limit * 1 || 100
        const skip = (page - 1) * limit;
        this.queryMongo = this.queryMongo.skip(skip).limit(limit);

        return this;
    }
  }

  module.exports = ApiFeatures;