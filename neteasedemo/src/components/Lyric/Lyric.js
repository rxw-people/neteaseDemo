import React, {Component} from 'react';
import {DownOutlined} from "@ant-design/icons";
import "./Lyric.css";
import Store from ".././Redux/Stores";
class Lyric extends Component {
    constructor(props) {
        super(props);
        console.log(this.props);
        this.state = {
            id:this.props.query
        }
    }
    gotoUp(){
        this.props.history.go(-1);
        console.log(this.state.id)
    }

    render() {
        return <div className={"lyric"}>
            <header>
                <DownOutlined onClick={()=>this.gotoUp()} />
                <span>{this.state.id.singerName}</span>
            </header>
        </div>
    }
}

export default Lyric;