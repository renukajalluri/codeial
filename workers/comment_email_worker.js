const queue = require("../config/kue");

const commentsMailer = require("../mailers/comments_mailer")

// the process function tells the worker whenever the new task is added into your queue
// we need to run the code in this processor function
queue.process('emails',function(job,done){
       console.log('emails worker is processing a job',job.data)

       commentsMailer.newComment(job.data)
       done();
})