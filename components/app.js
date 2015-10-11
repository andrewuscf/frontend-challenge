var React = require('react');

var App = React.createClass({
    getInitialState(){
        return {
            palettes: [],
            errorMessage: null,
            resultOffset: 0,
            updated: null
        }
    },
    componentDidMount(){
        this.getPalettes();
        window.setInterval(function () {
            this.setState({palettes: []});
            this.getPalettes();
        }.bind(this), 60000);
    },
    getPalettes(){
        $.getJSON("http://www.colourlovers.com/api/palettes/new?jsonCallback=?",
            function (allColours) {
                if (this.isMounted()) {
                    if (this.state.palettes.length == 0) {
                        this.setState({updated: new Date().toLocaleTimeString().replace(/:\d{2}\s/, ' ')})
                    }
                    this.setState({
                        palettes: this.state.palettes.concat(allColours),
                        resultOffset: this.state.resultOffset + 20
                    });

                }
            }.bind(this)
        );
    },
    render() {
        var renderPalettes = [];
        if (this.state.palettes.length > 0) {
            this.state.palettes.map(function (each) {
                var time = new Date(each.dateCreated).toLocaleTimeString().replace(/:\d{2}\s/, ' ');
                renderPalettes.push(
                    <div className="col-sm-6 col-xs-12 row paletteBox" key={each.id}>
                        <div className="col-sm-7 col-xs-7">
                            <div className="title row">{each.title}</div>
                            <div className="by-who row">by {each.userName} at {time}</div>

                            <div className="popular row">
                                <p className="popularText">
                                    {each.numViews} {(each.numViews == 1) ? 'view' : 'views' }
                                    &nbsp;
                                    {each.numVotes} {(each.numVotes == 1) ? 'vote' : 'votes' }
                                </p>
                            </div>
                        </div>
                        <img src={each.imageUrl} alt="" className="pImage col-sm-5 col-xs-5 float-right"/>
                    </div>);
            })
        }
        return (
            <div className="container">
                <div className="colour-title lFont row">
                    ColourLovers. <span className="hFont">Live.</span>
                </div>
                <div className="lastUpdated row">Last updated at {this.state.updated}</div>
                <div className="row">
                    {renderPalettes}
                </div>
            </div>
        );
    }
});

React.render(<App />, document.body);
