import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Link, Route} from "react-router-dom"
import "./Recommend.css";
import Swiper from "../../.././node_modules/swiper/dist/js/swiper.min";
import "../../.././node_modules/swiper/dist/css/swiper.min.css";
import ListDetails from ".././ListDetails/ListDetails";

class Recommend extends Component {
    constructor(props) {
        super(props);
        console.log(this.props)
        this.state = {
            data: [],
            songList: [],
            id: ""
        }
    }

    render() {
        return <div className={"recommend"}>
            <div className={"recommend-chart"}>
                <div></div>
                <div className="swiper-container">
                    <div className="swiper-wrapper">
                        {
                            this.state.data.map((v, i) => {
                                return <div className="swiper-slide" key={i}>
                                    <img src={v.imageUrl} alt=""/>
                                </div>
                            })
                        }
                    </div>
                    <div className="swiper-pagination"></div>
                </div>
            </div>
            <p className={"recommend-song"}>推荐歌单</p>
            <div className={"recommend-songList"}>
                <ul>
                    {
                        this.state.songList.map((v, i) => {
                            return <li className={"recommend-songList-list"} key={i}>
                                <Link to={`/recommend/listDetails/${v.id}`}>
                                    <img src={v.picUrl} alt=""/>
                                    <p>{v.name}</p>
                                    <span><i className={"el-icon-headset"}></i>{v.playCount}</span>
                                </Link>
                            </li>
                        })
                    }
                </ul>
            </div>
            <section>

            </section>
        </div>
    }

    componentWillUnmount() {
        this.swiper.destroy();
    }

    initSwiper() {
        this.swiper = new Swiper('.swiper-container', {
            pagination: '.swiper-pagination',
            paginationClickable: true,
            loop: true,
            autoplay: 3000
        });
    }

    componentDidMount() {
        // 推荐轮播图
        fetch("http://127.0.0.1:9999/banner").then(res => res.json()).then(data => {
            this.setState({
                data: data.banners
            }, () => {
                this.initSwiper();
            })
        })
        // 推荐歌单列表
        fetch("http://127.0.0.1:9999/personalized").then(res => res.json()).then(data => {
            console.log(data.result);
            data.result.forEach((v, i) => {
                if (String(v.playCount).length > 4) {
                    v.playCount = String(v.playCount).substr(0, String(v.playCount).length - 4) + "万";
                }
            })
            this.setState({
                songList: data.result
            })
        })
        window.addEventListener('scroll', this.bindHandleScroll, true);
    }

    bindHandleScroll = (event) => {
        // 滚动的高度
        const scrollTop = (event.srcElement ? event.srcElement.scrollTop : false)
            || window.pageYOffset
        console.log(scrollTop)


    }

    //在componentWillUnmount，进行scroll事件的注销
    componentWillUnmount() {
        window.removeEventListener('scroll', this.bindHandleScroll, true);
        // this.listener1();
    }
}

export default Recommend;