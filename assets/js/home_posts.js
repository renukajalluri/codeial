{
    // here we submitting post via ajax
    // the function which sends the data
    let createPost = function(){
        let newPostForm = $("#new-post-form");

        newPostForm.submit((e)=>{
            e.preventDefault();
            $.ajax({
                type:"post",
                url:"/posts/create",
                // converts form data into json
                data:newPostForm.serialize(),
                // recieve some data,the data in json format
                success : function(data){
                   let newPost = newPostDom(data.data.post);
                //    prepend to old posts
                // prepend -> new posts will appear first
                      $(`#post-list-container>ul`).prepend(newPost);
                      deletePost($(' .delete-post-button',newPost));

                      new ToggleLike($('.toggle-like-button',newPost))
                },
              
                error: (error)=>{
                    console.log(error.responseText)
                }
            })
        })
    }

    // recieved data and display the data
    // post->the data which i recieved
         let newPostDom = function(post){
             return $(`
                    <li id="post-${post._id}">
                            <small>
                                <a class="delete-post-button" href="/posts/destroy/${ post._id}">Delete</a>
                            </small>
                        <small class="user-name">
                        Posted By ${ post.user.name}
                        </small>
                        <li class="post-content">
                            ${ post.content}
                            </li>

                            <small>
                            <a class="toggle-like-button" data-likes = "0" href="/likes/toggle/?id=${post._id}&type=Post">0 Likes</a>
                            </small>
                        <div class="post-comments">
                           
                                <form action="/comments/create" method="post">
                                    <input type="text" name="content" placeholder="Add comment... " autocomplete="off">
                                    <input type="hidden" name="post" value="${ post._id }">
                                    <input  id="comment-button" type="submit" value="Add ">
                    
                                </form>
                                <div class="post-comments-list">
                                    <ul id="posts-comments-${ post._id}">
                                      
                                    </ul>
                                </div>
                    
                        </div>
                    
                        </li>`)

         }

// method to delete the post from dom
    let deletePost = (deleteLink)=>{
        $(deleteLink).click((e)=>{
                 e.preventDefault();

              $.ajax({
                  type:'get',
                  url: $(deleteLink).prop('href'),
                 //   we getting data which has post id which we are deleting
                  success:(data)=>{
                       $(`#post-${data.data.post_id}`.remove());
                  },
                  error:(error)=>{
                      console.log(error.responseText)
                  }
              })   
        })
    }


    createPost()
}