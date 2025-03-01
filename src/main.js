const process = require('node:process');
const { getUserEvents, getRepository } = require('./github_api');
const { displayHistory } = require('./display');
const { loadCache, addCache, saveCache, getDataCache } = require('./cache');

(async () => {
    try{
        let cache = []
        const arguments = process.argv.slice(2)
        // Load cache từ file
        cache = await loadCache(cache)

        if ( typeof cache !== 'object' || cache === null) {
            console.log("ERROR: Cache is invalid!")
            return
        }
        
        // Nên chia tách các điều kiện ra đẻ thông báo lỗi dễ hiểu hơn
        const userName = arguments[0]
        const endpoint = arguments[1]?? 'userEvents'
        // Nhận vào eventType
        const slug = arguments[2]?? null
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

        let dataList = null

        // Kiểm tra xem dữ liêu đã được cache hay chưa
        let dataInCache = getDataCache(userName, cache )
        if( dataInCache ) {
            console.log(`Data for ${userName} is already in cache.`)
            dataInCache = filterEvents(dataInCache, slug)
            displayHistory(dataInCache)
            return 
        }

        // Kiểm tra xem user có tồn tại hay không
        
        if (endpoint === 'userEvents') {
            const eventType = slug
            dataList = await getUserEvents(userName)
            dataList = filterEvents(dataList, eventType)
        }

        if(endpoint === 'repoEvents') {
            const repoName = slug
            dataList = await getRepository(userName, repoName)

            // Xử lý kết quả trả về cho từng event trong payload của repo

            

            // dataList = filterEvents(dataList, repoName)
        }


        displayHistory(dataList)
        // Lưu dữ liệu vào cache
        cache = addCache(userName, dataList, cache, 5000)
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


function filterEvents(events, eventType) {
    try {
        if(!eventType ||  !Array.isArray(events)) return events 
        return events.filter(event => event.type === eventType)
    } catch(error) {
        console.log(error)
        return events
    }
    
}