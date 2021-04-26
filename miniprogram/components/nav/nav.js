// components/nav.js
const app = getApp()
Component({
    options: {
        multipleSlots: true
    },
    properties: {
        backgroundColor:{
            type: String,
        },
        Mainpage:{
            type:Number
        }
    },
    data: {},
    ready() {
        let {
            statusBarHeight,
            navBarHeight
        } = app.globalData;

        this.setData({
            statusBarHeight,
            navBarHeight
        })
    },
    methods: {
        back() {
            wx.navigateBack({
                delta:1
            })
        }
    }
})

