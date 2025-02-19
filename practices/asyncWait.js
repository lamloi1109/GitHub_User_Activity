// Async await là gì
async function sendRequest() {
    try{
        const url = ' https://api.github.com/users/lamloi1109/events'
        const response = await fetch(url)
        console.log(response)
        const data = await response.json()
        console.log(data)
    } catch(error) {
        console.log(error)  
    }
}
// Nó hoạt động như thế nào?
sendRequest()