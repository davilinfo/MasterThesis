class Utils {
    static compareFoodsByCategories(a,b){
        if (a.category > b.category){
            return 1;
        }
        if (a.category < b.category){
        return -1;
        }
        return 0;
    }
}

export default Utils;