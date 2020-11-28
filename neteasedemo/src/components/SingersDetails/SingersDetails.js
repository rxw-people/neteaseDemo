import React, {Component} from 'react';
import "./SingersDetails.css";
import {ArrowLeftOutlined, PlayCircleOutlined, PlusOutlined} from '@ant-design/icons';
import {CSSTransition} from "react-transition-group";
import Store from ".././Redux/Stores";
import {addSong} from ".././Redux/Actions"
class SingersDetails extends Component {
    constructor(props) {
        super(props);
        console.log(this.props.match.params.id)
        this.state = {
            dataImg: "",
            data: [],
            opacitys: "1",
            isListDetail:false
        }
    }

    gotoUp() {
        this.props.history.go(-1);
    }
    addSingerSong(id,singerName,songerName,imgUrl){
        Store.dispatch(addSong(id,this.props.match.params.id,singerName,songerName,imgUrl))
    }

    render() {
        return <CSSTransition in={this.state.isListDetail} timeout={2000} classNames={"listDetail"}>
            <div className={"singersDetails"}>
                <img className={"singersDetails-img"} src={this.state.dataImg.img1v1Url} alt=""/>
                <header className={"singersDetails-header"}>
                    <img src={this.state.dataImg.img1v1Url} alt=""/>
                    <ArrowLeftOutlined onClick={() => this.gotoUp()}/>{this.state.dataImg.name}
                </header>
                <div className={"singersDetails-collect"} style={{opacity: this.state.opacitys}}>
                    <PlusOutlined/>收藏
                </div>
                <ul className={"singersDetails-list"}>
                    <div>
                        <PlayCircleOutlined/>
                        <span>播放全部</span>
                        <span>(共{this.state.data.length}首)</span>
                    </div>
                    {
                        this.state.data.map((v, i) => {
                            return <li key={v.id} onClick={()=>this.addSingerSong(v.id,v.name,v.ar[0].name,v.al.picUrl)}>
                                <p>{i + 1}</p>
                                <div>
                                    <p>{v.name}</p>
                                    <p>{v.ar[0].name} - {v.al.name}</p>
                                </div>
                            </li>
                        })
                    }
                </ul>
            </div>
        </CSSTransition>
    }

    componentDidMount() {
        fetch("http://127.0.0.1:9999/artists?id=" + this.props.match.params.id, {method: "get"}).then(res => res.json()).then(data => {
            console.log(data);
            this.setState({
                dataImg: data.artist,
                data: data.hotSongs
            })
        })
        window.addEventListener("scroll", this.singersDetailsHandle, true);
        this.setState({
            isListDetail:!this.state.isListDetail
        })
    }

    singersDetailsHandle = (event) => {
        const scrollTop = (event.srcElement ? event.srcElement.scrollTop : false)
            || window.pageYOffset
        if (scrollTop >= 10) {
            this.setState({
                opacitys: "0.5"
            })
        } else {
            this.setState({
                opacitys: "1"
            })
        }
    }

    //在componentWillUnmount，进行scroll事件的注销
    componentWillUnmount() {
        window.removeEventListener('scroll', this.singersDetailsHandle, true);
    }
}

export default SingersDetails;