function displayData(datas) {
    try {
        
    if(  typeof datas !== 'object' ) {
        console.log(`ERROR: Invalid Input`)
        return
    }

    if(Object.keys(datas).length === 0){
        console.log(`ERROR: No data to display`)
        return
    }

    // Early return Handle error    
    if((Object.keys(datas).includes('status') || Object.keys(datas).includes('message') )&& datas?.status !== 200 ) {

        const typeMessage = Object.keys(datas).includes('status') ? 'ERROR' : 'INFO'
        const status = typeMessage === 'ERROR' ? datas?.status : 200
        const message = `${typeMessage}: ${status} ${datas?.message}`
        console.log(message)
        return
    }

    console.log('Output: ')

    if(datas?.type === 'User') {

        console.log(`- login: ${datas.login}`)
        console.log(`- email: ${datas.email}`)
        console.log(`- name: ${datas.name}`)
        console.log(`- company: ${datas.company}`)
        return
    }

    datas.forEach(event => {
        if(event.type === 'PushEvent') {
            console.log(`- Pushed ${event.payload.commits.length} commits to ${event.repo.name}.`)
            event.payload.commits.forEach((commit) => {
                console.log(`+ Message: ${commit.message} at ${event.created_at}`)
            })
        }
        if(event.type === 'Delete') {
            console.log(`- Deleted ${event.payload.ref} at ${event.repo.name} on ${event.repo.created_at}.`)
        }

        if(event.type === 'CreateEvent') {
            console.log(`- Created ${event.payload.ref_type} ${event.payload.ref} at ${event.repo.name} on ${event.created_at}.`)
        }

        if(event.type === 'IssuesEvent') {
            console.log(`- Opened a new issue in ${event.repo.name} on ${event.created_at}.`)
        }

        if(event.type === 'IssuesCommentEvent') {
            console.log(`- Commented on an issue in ${event.repo.name} on ${event.created_at}.`)
        }

        if(event.type === 'PullRequestEvent') {
            console.log(`- Opened a new pull request in ${event.repo.name} on ${event.created_at}.`)
        }

        if(event.type === 'PullRequestReviewCommentEvent') {
            console.log(`- Opened a new pull request review comment in ${event.repo.name} on ${event.created_at}`)
        }

        if(event.type === 'WatchEvent') {
            console.log(`- Watched a repo ${event.repo.name} on ${event.created_at}.`)
        }

        if(event.type === 'ForkEvent' ) {
            console.log(`- Forked a repo ${event.repo.name} on ${event.created_at}.`)
        }

        if (event.type === 'ReleaseEvent') {
            console.log(`- Released a repo ${event.repo.name} on ${event.created_at}.`)
        }

        if (event.type === 'MemberEvent') {
            console.log(`- Member ${event.payload.action} to repository ${event.repo.name} on ${event.created_at}`)
        }

        if (event.type === 'GollumEvent') {
            console.log(`- ${event.payload.pages.length} Page: `)
            event.payload.pages.forEach(page => { 
                console.log(`${page.name} ${page.action}.`)
            })
        }
    });    
    } catch (error) {
        console.log(error) 
    }
}

exports.displayData = displayData