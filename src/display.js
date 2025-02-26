function displayHistory(userEvents) {
    try {
        
    if(  typeof userEvents !== 'object' ) {
        console.log(`ERROR: Invalid Input`)
        return
    }

    if(Object.keys(userEvents).length === 0){
        console.log(`ERROR: No data to display`)
        return
    }

    // Early return Handle error    
    if((Object.keys(userEvents).includes('status') || Object.keys(userEvents).includes('message') )&& userEvents?.status !== 200 ) {

        const typeMessage = Object.keys(userEvents).includes('status') ? 'ERROR' : 'INFO'
        const status = typeMessage === 'ERROR' ? userEvents?.status : 200
        const message = `${typeMessage}: ${status} ${userEvents?.message}`
        console.log(message)
        return
    }

    console.log('Output: ')

    userEvents.forEach(event => {
        if(event.type === 'PushEvent') {
            console.log(`- Pushed ${event.payload.commits.length} commits to ${event.repo.name}.`)
        }
        if(event.type === 'Delete') {
            console.log(`- Deleted ${event.payload.ref} at ${event.repo.name}.`)
        }

        if(event.type === 'CreateEvent') {
            console.log(`- Created ${event.payload.ref_type} ${event.payload.ref} at ${event.repo.name}.`)
        }

        if(event.type === 'IssuesEvent') {
            console.log(`- Opened a new issue in ${event.repo.name}.`)
        }

        if(event.type === 'IssuesCommentEvent') {
            console.log(`- Commented on an issue in ${event.repo.name}.`)
        }

        if(event.type === 'PullRequestEvent') {
            console.log(`- Opened a new pull request in ${event.repo.name}.`)
        }

        if(event.type === 'PullRequestReviewCommentEvent') {
            console.log(`- Opened a new pull request review comment in ${event.repo.name}`)
        }

        if(event.type === 'WatchEvent') {
            console.log(`- Watched a repo ${event.repo.name}.`)
        }

        if(event.type === 'ForkEvent' ) {
            console.log(`- Forked a repo ${event.repo.name}.`)
        }

        if (event.type === 'ReleaseEvent') {
            console.log(`- Released a repo ${event.repo.name}.`)
        }

        if (event.type === 'MemberEvent') {
            console.log(`- Member ${event.payload.action} to repository ${event.repo.name}`)
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

exports.displayHistory = displayHistory