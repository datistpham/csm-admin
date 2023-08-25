export default function numberWithCommas(x) {
    if(x !== undefined) {
        console.log("x", x)
        if(typeof x=== "number") {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
        else {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    }
}