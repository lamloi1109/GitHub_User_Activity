const url = process.env.GITHUB_API_URL
const https = require('https')
const { resolve } = require('path')
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
        const userEvents = await handleFetch(url)
        return userEvents
    } catch(error) {
        console.log(error.message)
        return {
            status: 500,
            message: error.message
        }
    }
}

async function getUser(userName) {
    try {   
        const url = `https://api.github.com/users/${userName}`

        const user = await handleFetch(url)
        return user
    } catch(error) {
        console.log(error.message)
    }
}

async function getRepository(userName, repoName) {
    try{
        const url = `https://api.github.com/repos/${userName}/${repoName}/events` 
        const repoEvents = await handleFetch(url)
        return repoEvents

    } catch(error) {
        console.log(error.message)
        return {
            status: 500,
            message: error.message
        }
    }
}





// Khi gửi yêu cầu lên server
// Cần quan tâm đến các yếu tố như
// Timeout
// Kết nối mạng
// Lỗi từ server
// Cần có xủ lý khi server phẩn hồi quá lâu tránh việc chờ đợi vô hạn

// Đối với fetch sẽ không tự handle các lỗi 4xx và 5xx
// Cần phải tự handle hoặc sử dụng thư viện khác để handle

async function handleFetch(url, options) {
    try{

        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(),5000)
        const response = await fetch(url, {...options, signal: controller.signal });
        const data = await response.json()
        clearTimeout(timeout)
        if (Object.keys(data).includes('message')) {
            throw new Error(data.message)
        }

        return data
    } catch(error)
    {
        if(error.message === 'AbortError') {
            return {
                message: 'ERROR: Request timeout'
            }
        }        
        if (error.message === 'Failed to fetch' ||
            error.message === 'Network error'
        ) {
            return {
                message: 'ERROR: No internet connection'
            }
        }
        // Lỗi khác
        return { message: `ERROR: ${error.message}` }    
    }   
}

exports.getUserEvents = getUserEvents
exports.handleFetch = handleFetch
exports.getRepository = getRepository
exports.getUser = getUser