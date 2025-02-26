const process = require('node:process');
const { getUserEvents } = require('./github_api');
const { displayHistory } = require('./display');
const { loadCache, addCache, saveCache, getDataCache } = require('./cache');
(async () => {
    try{
        let cache = []
        const arguments = process.argv.slice(2)
        // Kiểm tra số lượng tham số đầu vào
        // Nhận vào 1 tham số
        // if( arguments.length === 0 || arguments.length > 1 ) {
        //     console.log(`ERROR: Số lương tham số tối đa là 1`)
        //     return
        // }
        
        if(arguments.length === 0) {
            console.log(`ERROR: Expected 1 argument, but got none.`)
            return
        }

        if(arguments.length > 1 ) {
            console.log(`ERROR: Expected only 1 argument, but got ${arguments.length}`)
            console.log(arguments)
            return
        }

        // Load cache từ file
        cache = await loadCache(cache)

        if ( typeof cache !== 'object' || cache === null) {
            console.log("ERROR: Cache is invalid!")
            return
        }

        // Nên chia tách các điều kiện ra đẻ thông báo lỗi dễ hiểu hơn
        const userName = arguments[0]

        // Kiểm tra xem nó có phải là một github username hợp lệ hay không
        // Các chữ cái, số và dấu gạch ngang
        // Độ dài tối đa là 39 ký tự    
        // Case Sensitive (Không phân biệt hoa thường)

        // Nhận vào username (Github)
        // Kiểm tra xem username có tồn tại hay không
        // Báo lỗi nếu như username không tồn tại
        
        // const userNameRegex = new RegExp('/^(?!-)(?!.*--)[a-zA-Z0-9-]{1,39}(?<!-)$/')
        // if( !userNameRegex.test(userName)) {
        //     console.log(`ERROR: Invalid UserName`)
        // }

        // Thay vì kiểm tra chung thì kiểm tra riêng sẽ có thông báo chi tiết hon về lỗi của user
        // Mặc dù sẽ tốn nhiều code hơn

        const isValidUserName = validateUserName(userName)
        if(!isValidUserName) return 

        // Kiểm tra xem dữ liêu đã được cache hay chưa
        const dataInCache = getDataCache(userName, cache )
        if( dataInCache ) {
            console.log(`Data for ${userName} is already in cache.`)
            displayHistory(dataInCache)
            return 
        }

        // Kiểm tra xem user có tồn tại hay không
        const userEvents = await getUserEvents(userName)
        displayHistory(userEvents)

        // Lưu dữ liệu vào cache
        cache = addCache(userName, userEvents, cache, 5000)
        saveCache(cache)

    } catch(error) {
        console.log(error)
    }
})()

// Viết hàm kiểm tra xem user name có hợp lệ hay không
// Chia tách các điều kiện kiểm tra để có thông báo lỗi phù hợp nhất đến user
function validateUserName(userName) {
    try {
        // Kiểm tra độ dài min 1 - max 39
        // Kiểm tra trong tên có ký tự đặc biết hay không 
        // Kiểm tra trong tên chưa được chứa Chữ Hoa, chữ thường, số
        if(userName.length < 0 || userName.length > 39) {
            console.log(`ERROR: UserName must be between 1 and 39 characters.`)
            return false
        }

        if(/^-|-$/.test(userName)) {
            console.log(`ERROR: UserName cannot start or end with a hyphen(-).`)
            return false
        }

        if(/--/.test(userName)) {
            console.log("ERROR: Username cannot contain consecutive hyphens ('--').")
            return false
        }

        if(!/^[A-Za-z0-9]+$/.test(userName)) {
            console.log(`ERROR: UserName can only contain letters, numbers, and hyphens(-).`)
            return false
        }
        return true;
    } catch(error)
    {
        console.log(error)
    }
    return false;
}