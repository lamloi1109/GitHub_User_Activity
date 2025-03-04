const { handleFetch } = require('../src/github_api');
const fetchMock = require('jest-fetch-mock');
fetchMock.enableMocks();

beforeEach(() => {
    fetch.resetMocks();
})

test('OK', async () => {
    // Giải thích các lệnh phía dưới
    // - fetch.mockResponseOnce: giả lập việc fetch trả về dữ liệu
    // - JSON.stringify: chuyển object sang JSON
    // - handleFetch: gọi hàm handleFetch
    // - expect(fetch).toHaveBeenCalledTimes(1): kiểm tra hàm fetch được gọi 1 lần
    // - expect(fetch).toHaveBeenCalledWith: kiểm tra hàm fetch được gọi với đúng tham số

    fetch.mockResponseOnce(JSON.stringify({login: "octocat", id: 1}))
    const result = await handleFetch('https://api.github.com/users/octocat')
    expect(result).toEqual({login: 'octocat', id: 1})
    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch).toHaveBeenCalledWith('https://api.github.com/users/octocat', expect.any(Object));
})


test('Not Founđ', async () => { 
    fetch.mockResponseOnce(JSON.stringify({
        message: "Not Found",
        status: 404
    }))

    const result = await handleFetch('https://api.github.com/users/octocdsads')
    expect(result).toEqual({message: 'ERROR: Not Found'})
} )

test('Request timeout', async () => {
    // Giải thích các lệnh phía dưới
    // - fetch.mockImplementation: giả lập việc fetch trả về một promise
    // - setTimeout: sau 6 giây sẽ reject promise với lỗi AbortError
    // - handleFetch: gọi hàm handleFetch
    // - expect: kiểm tra kết quả trả về của hàm handleFetch

    fetch.mockImplementation(() => new Promise( (_, reject) => {
        setTimeout(() => reject(new Error('AbortError')), 6000) 
    }))
    const result = await handleFetch('https://api.github.com/users/octocat')
    expect(result).toEqual({message: 'ERROR: Request timeout'})

}, 7000)


test('Network error', async () => { 
    fetch.mockReject(new Error('Network error'))
    const result = await handleFetch('https://api.github.com/users/octocat')
    expect(result).toEqual({message: 'ERROR: No internet connection'})
} )