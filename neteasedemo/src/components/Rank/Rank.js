import React, {Component} from 'react';
import { Link,Route } from "react-router-dom"
import "./Rank.css";

class Rank extends Component {
    constructor(props) {
        super(props);
        this.state = {
            officialRank: [],
            officialList: []
        }
    }

    render() {
        return <div className={"rank"}>
            <div className={"rank-officialRank"}>
                <p>官方榜</p>
                {
                    this.state.officialRank.map((v, i) => {
                        return <div key={v.id}>
                            <Link to={"/rank/RankDetails/"+v.id}>
                                <div className={"rank-officialRank-left"}>
                                    <img src={v.coverImgUrl} alt=""/>
                                    <span>{v.updateFrequency}</span>
                                </div>
                                <ol className={"rank-officialRank-right"}>
                                    {
                                        v.tracks.map((n, j) => {
                                            return <li key={j}>
                                                <span>{n.first} - </span>
                                                <span>{n.second}</span>
                                            </li>
                                        })
                                    }
                                </ol>
                            </Link>
                        </div>
                    })
                }
            </div>
            <p className={"rank-p"}>全球榜</p>
            <div>
                <ul className={"rank-officialList"}>
                    {
                        this.state.officialList.map((v,i)=>{
                            return <li key={v.id}>
                                <Link to={"/rank/RankDetails/"+v.id}>
                                    <img src={v.coverImgUrl} alt=""/>
                                    <span>{v.updateFrequency}</span>
                                </Link>
                            </li>
                        })
                    }
                </ul>
            </div>
        </div>
    }

    componentDidMount() {
        fetch("http://127.0.0.1:9999/toplist/detail", {method: "get"}).then(res => res.json()).then(data => {
            console.log(data.list);
            this.setState({
                officialRank: data.list.splice(0, 4),
                officialList: data.list
            }, () => {
                console.log(this.state)
            })
        })
    }
}

export default Rank;