const React = require('react');
const timg = require('./images/timg.png');
const { a } = require('./tree-shaking');
require('./search.scss');

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Text: null
        };
    }
    loadComponent() {
        import('./test').then(Text => {
            this.setState({
                Text: Text.default
            });
        });
    }
    render() {
        // const a1 = a(); // tree-shaking 不打包
        const { Text } = this.state;
        return (
            <div className="search-text">
                {Text ? <Text /> : null}
                <div>search text</div>
                <img src={timg} alt="" onClick={this.loadComponent.bind(this)} />
            </div>
        );
    }
}

module.exports = <Search />;
