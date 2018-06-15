/**
 * Created by hao.cheng on 2017/5/7.
 */
import React from 'react';
import img from '../style/imgs/404.png';
import img404 from '../style/imgs/404img.jpg'
const style = {
    backgroundImage: 'url(' + img404 + ')',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100% 100%',
    backgroundAttachment: 'fixed',
    height: '100vh',
}

class NotFound extends React.Component {
    state = {
        animated: ''
    };
    enter = () => {
        this.setState({ animated: 'hinge' })
    };
    render() {
        return (
            // <div className="center" style={{height: '100vh', background: '#ececec', overflow: 'hidden'}}>
            //     <img src={img} alt="404" className={`animated swing ${this.state.animated}`} onMouseEnter={this.enter} />
            // </div>
            <div style={style} >
                {/* <img src={img404} /> */}
            </div>
        )
    }
}

export default NotFound;