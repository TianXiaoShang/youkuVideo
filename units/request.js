class Request{
    getData(options={}){
        const url = options.url;
        const method = options.method || "GET";
        const data = options.data || {};
        const header = options.header || {};
        return new Promise((resolve,rejec) => {
            wx.request({
                data,
                method,
                url,
                header,
                success:res => {
                    resolve(res)
                },
                fail:err => {
                    reject(err);
                    this._showError()
                }
            })
        })
        
    }
    _showError(){
        wx.showToast({
            title:'请求错误',
            icon:'none'
        })
    }
}



class myGetData extends Request{
    getSwiperData(){
        return this.getData({
            url:"http://www.thexxdd.cn/banner/"
        })
    }
    getInlandRecommendData(){
        return this.getData({
            url:"http://www.thexxdd.cn/recommend/"
        })
    }
    getHKRecommendData(url='http://www.thexxdd.cn/selected/'){
        return this.getData({
            url
        })
    }
    getDetailData(type,id){
        return this.getData({
            url:`http://www.thexxdd.cn/${type}/${id}`
        })
    }
    getSearchVideo(name){
        return this.getData({
            url:`http://www.thexxdd.cn/details/?search=${name}`
        })
    }
    getStoryData(){
        return this.getData({
            url:"http://www.thexxdd.cn/video/"
        })
    }
    getStoryDetail(id){
        return this.getData({
            url:`http://www.thexxdd.cn/film/${id}`
        })
    }
    getUserCode(code){
        return this.getData({
            url:"http://www.thexxdd.cn/program/",
            method:'POST',
            data:{"code":code},
            header:{"content-type": "application/json"}
        })
    }

    //我喜欢部分
    getUserFavsList(){
        var wxusers = wx.getStorageSync('token')
        return this.getData({
            url:`http://www.thexxdd.cn/userfavs/`,
            header:{
                "content-type": "application/json",
                "Authorization":`JWT ${JSON.parse(wx.getStorageSync('token'))}`
            }
        })
    }
    addUserFavs(id){
        return this.getData({
            url:`http://www.thexxdd.cn/userfavs/`,
            method:'POST',
            data:{"goods":id},
            header:{
                "content-type": "application/json",
                "Authorization":`JWT ${JSON.parse(wx.getStorageSync('token'))}`
            }
        })
    }
    deleteUserFavs(id){
        return this.getData({
            url:`http://www.thexxdd.cn/userfavs/${id}`,
            method:'DELETE',
            header:{
                "content-type": "application/json",
                "Authorization":`JWT ${JSON.parse(wx.getStorageSync('token'))}`
            }
        })
    }
    checkUserFavs(id){
        return this.getData({
            url:`http://www.thexxdd.cn/userfavs/${id}`,
            header:{
                "content-type": "application/json",
                "Authorization":`JWT ${JSON.parse(wx.getStorageSync('token'))}`
            }
        })
    }

    // 以下留言接口暂未实现。。。。。。
    // getMessagesList(){
    //     return this.getData({
    //         url:`http://www.thexxdd.cn/messages`,
    //         header:{
    //             "content-type": "application/json",
    //             "Authorization":`JWT ${JSON.parse(wx.getStorageSync('token'))}`
    //         }
    //     })
    // }
    // createMessages(data){
    //     return this.getData({
    //         url:`http://www.thexxdd.cn/messages`,
    //         type:"POST",
    //         data,
    //         header:{
    //             "content-type": "application/json",
    //             "Authorization":`JWT ${JSON.parse(wx.getStorageSync('token'))}`
    //         }
    //     })
    // }
    // deleteMessages(id){
    //     return this.getData({
    //         url:`http://www.thexxdd.cn/messages/${id}`,
    //         type:"DELETE",
    //         header:{
    //             "content-type": "application/json",
    //             "Authorization":`JWT ${JSON.parse(wx.getStorageSync('token'))}`
    //         }
    //     })
    // }
}
export {myGetData}