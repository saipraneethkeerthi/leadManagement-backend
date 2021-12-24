const { url } = require('../config')

// This file is exporting an Object with a single key/value pair.
// However, because this is not a part of the logic of the application
// it makes sense to abstract it to another file. Plus, it is now easily 
// extensible if the application needs to send different email templates
// (eg. unsubscribe) in the future.
// console.log("...fff...",url)
module.exports = {

  confirm: (id,email) => ({
    from: 'Admin', // sender address
    to: email, // list of receivers
    subject: 'React Confirm Email',
    html: `
      <a href='${url}/resetPassword/confirm/${id}'>
        click to confirm email
      </a>
    `,      
    text: `Copy and paste this link: ${url}/confirm/${id}`
  })
  
}