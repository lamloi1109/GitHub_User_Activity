const fs = require('fs')
const cachePath = `${__dirname}\\data.json`
// Các bước để cache dữ liệu giảm số lần gửi request lên server
// Tạo một object -> Có cấu trúc
// Mỗi lần gửi req lên server đều vào cache kiểm tra cache đã hết hạn hay chưa
// Nếu chưa thì gửi req lên server nếu không thì lấy trong cache ra dùng
// Nếu cache đã hết hạn thì gửi req lên server và lưu vào cache

// Hàm load cache từ file json

// Cache structure
// [{data
// - command
// - time
// - data
// timeExpired = time + timeToLive}, ...]


async function loadCache(cache){
    try{
        if(cache === null || typeof cache !== 'object' ) {
            console.log("Cache is invalid!")
            return null
        }

        // Nếu như json file không tồn tại thì tạo file mới
        if(fs.existsSync(cachePath) === false) {
            await saveCache(cache)
            return cache
        }

        let data =   fs.readFileSync(cachePath, (error) => {
            console.log(error)
        })
        cache = JSON.parse(data)
        return cache
    } catch(error) {
        console.log(error)
        return null
    }
}

// Hàm save cache vào file json 
async function saveCache(cacheData) {
    try {

        // Kiểm tra đầu vào có phải là một object hay không
        if (typeof cacheData !== 'object' || cacheData === null) {
            console.log("Cache data is invalid data type!")
            return 
        }

        const data = JSON.stringify(cacheData)
        // writeFileSync ghi dữ liệu đồng bộ
        // writeFile ghi dữ liệu bất đồng bộ
        await fs.writeFile(cachePath, data, ((error) => {
            console.log(error)
        }))
    } catch(error) {
        console.log(error)
        return 
    }
}
// Hàm kiểm tra cache đã hết hạn hay chưa
function getDataCache(command, cache) {
    try {
        //
        if(typeof cache !== 'object' || cache === null ||!Array.isArray(cache)) {
            console.log("Cache is invalid!")
            return null
        }
        // Kiểm tra lệnh xem đã thực thi nay chưa
        const cacheData = cache.find(data => data.data.command === command)

        // Nếu như không có trong cache
        if (!cacheData) return null

        // Nếu lệnh đã thực thi vậy thì còn thời hạn hay không
        // isExpired(cacheData) -> true hết hạn
        //  isExpired(cacheData) -> false còn thời hạn
        if (cacheData && isExpired(cacheData)) return null
        
        // Thời hạn so sánh giữa currentTime và expiredTime
        // Nếu như currentTime >= expiredTime -> hết hạn
        // Nếu như hết thời hạn thì trả về false
        // Nếu như còn thời hạn thì trả về true

        return cacheData.data.data
    } catch (error) {
        console.log(error)
        return false
    }
}

function isExpired(cacheData) {
    try {
        const currentTime = new Date().getTime()
        const expiredTime = cacheData.timeExpired
        return currentTime < expiredTime        
    } catch (error) {
        console.log(error)
        
        return false
    }    
}

// Hàm clear cache
function clearCache() {
    try {
        saveCache([])        
    } catch (error) {
        console.log(error)
    }
}

// Thêm dữ liệu vào cache
function addCache(command, dataCache, cache ,timeToLive) {
    try {
        // kiểm tra đầu vào
        if (typeof cache !== 'object' || cache === null) {
            console.log("Cache is invalid!")
            return
        }

        // Kiểm tra xem lệnh có hợp lệ hay không
        if( typeof command !== 'string' || command.length === 0)  {
            console.log("Command is invalid!")
            return
        }
        

        // Kiểm tra xem lệnh đã có tồn tại trong cache hay chưa
        // Nếu đã có rồi thì cập nhật dữ liệu mới vào
        // Nếu chưa có thì thêm mới vào
        // Kiểm tra xem data có hợp lệ hay không

        if(typeof dataCache !== 'object' || dataCache === null) {
            console.log("Data is invalid!")
            return
        }

        if (timeToLive <= 0 || typeof timeToLive !== 'number') {
            console.log("Time to live is invalid!")
            return
        }

        const cacheData = cache.find(data => data.command === command)
        const currentTime = new Date().getTime()

        if( !cacheData ) {
            cache.push({
                data: { command, 
                        time: currentTime,
                        data: dataCache
                },
                timeExpired: currentTime + timeToLive
            })
        }

    return cache
    } catch(error) {
        console.log(error)
        return null
    }
}


exports.loadCache = loadCache
exports.saveCache = saveCache
exports.getDataCache = getDataCache
exports.clearCache = clearCache
exports.addCache = addCache
exports.isExpired = isExpired
