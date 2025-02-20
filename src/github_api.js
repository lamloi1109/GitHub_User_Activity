const url = process.env.GITHUB_API_URL

// Hàm xử lý việc gửi yêu cầu
// Hàm xử lý việc nhận yêu cầu
// Hàm kiểm tra xem user có tồn tại hay không

// Có bao nhiêu cách để gửi 1 req lên SERVER trong javascript?
// Dùng fetch
// - Async await -> Stack -> Queue -> Micro Queue -> Macro Queue
// - Promise
// XMLHttpRequest

// Làm cách nào mà một req được gửi đi thông qua http
// Một gói tin được gửi đi sẽ trông như thế nào?
// Ý nghĩa của các gói tin
// Server sẽ làm gì khi nhận được gói tin?
// Tại sao phải xử lý JSON response
// JSON response là gì


 async function getUserEvents(userName) {
    try{
        const url = `https://api.github.com/users/${userName}/events` 
        const response = await fetch(url)
        const data = await response.json()
        return data
    } catch(error) {
        console.log(error.message)
        return {
            status: 500,
            message: error.message
        }
    }
}

exports.getUserEvents = getUserEvents