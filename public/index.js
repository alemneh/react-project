var BoxerBox = React.createClass({
  loadBoxersFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleBoxerSubmit: function(boxer) {
    var boxers = this.state.data;
    var newBoxer = boxers.concat([boxer]);
    this.setState({data: newBoxer});
    $.ajax({
      url: this.props.url,
      type: 'POST',
      data: boxer,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        this.setState({data: boxers});
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadBoxersFromServer();
    setInterval(this.loadBoxersFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <div className="boxerBox">
        <h1>P4P List</h1>
        <BoxerList data={this.state.data} />
        <br />
        <br />
        <h2>Add New Boxer to List</h2>
        <BoxerForm onBoxerSubmit={this.handleBoxerSubmit} />
      </div>
    );
  }
});

var BoxerList = React.createClass({
  render: function() {
    var boxerNodes = this.props.data.map(function(boxer) {
      return (
        <Boxer  name={boxer.name} division={boxer.division} belt={boxer.belt} key={boxer._id}>


        </Boxer>
      );
    });
    return (
      <div className="boxerList">
        {boxerNodes}
      </div>
    );
  }
});

var BoxerForm = React.createClass({
  getInitialState: function() {
    return {name: '', division: '', belt: ''};
  },
  handleBoxerChange: function(e) {
    this.setState({name: e.target.value});
  },
  handleDivisionChange: function(e) {
    this.setState({division: e.target.value});
  },
  handleBeltChange: function(e) {
    this.setState({belt: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var name = this.state.name.trim();
    var division = this.state.division.trim();
    var belt = this.state.belt.trim();
    if(!division || !name || !belt) {
      return;
    }
    this.props.onBoxerSubmit({name: name, division:division, belt:belt});
    this.setState({name: '', division: '', belt: ''});
  },
  render: function() {
    return (
      <form className="boxerForm" onSubmit={this.handleSubmit}>
        <input
          type="text"
          placeholder="Boxer name"
          value={this.state.name}
          onChange={this.handleBoxerChange}
        />
        <input
          type="text"
          placeholder="Division"
          value={this.state.division}
          onChange={this.handleDivisionChange}
         />
         <input
           type="text"
           placeholder="Belt"
           value={this.state.belt}
           onChange={this.handleBeltChange}
          />
        <input type="submit" value="Post" />
      </form>
    );
  }
});

var Boxer = React.createClass({
  getInitialState: function() {
    return {name: this.props.name, division: this.props.division, belt: this.props.belt};
  },
  handleNameChange: function(e) {
    this.setState({name: e.target.value});
  },
  handleDivisionChange: function(e) {
    this.setState({division: e.target.value});
  },
  handleBeltChange: function(e) {
    this.setState({belt: e.target.value});
  },
  handleUpdate: function(e) {
    e.preventDefault();
    var name = this.state.name.trim();
    var division = this.state.division.trim();
    var belt = this.state.belt.trim();
    if(!name || !belt || !division) {
      return;
    }
    $.ajax({
      url: '/api/boxers/' + this.props.name,
      type: 'PUT',
      data: {name: name, division:division, belt:belt},
      success: function(data) {
        console.log(data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.log(err);
        this.setState({data: boxerss});
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });

  },
  handleDelete: function() {
    console.log(this.props.name);
    console.log(this.props.author);
    $.ajax({
      url: '/api/boxers/' + this.props.name,
      type: 'DELETE',
      success: function(data) {
        console.log(data);
      }.bind(this),
      error: function(xhr, status, err) {
        this.setState({data: boxers});
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    return (
      <div className="boxer">
        <h2 className="boxerName">
          Boxer: {this.props.name}
        </h2>
        <h3 className="boxerDivision">
          Division: {this.props.division}
        </h3>
        <h3 className="boxerBelt">
          Belts: {this.props.belt}

        </h3>
        <button type="button"  onClick={this.handleDelete}>Delete {this.props.name}</button>
        <form onSubmit={this.handleUpdate}>
          <input
            type="text"
            placeholder="Your name"
            value={this.state.name}
            onChange={this.handleNameChange}
          />
          <input
            type="text"
            placeholder="Your name"
            value={this.state.division}
            onChange={this.handleDivisionChange}
          />
          <input
            type="text"
            placeholder="Your name"
            value={this.state.belt}
            onChange={this.handleBeltChange}
          />
          <input type="submit" value="Update" />
        </form>
      </div>
    );
  }
});


ReactDOM.render(
  <BoxerBox url="/api/boxers" pollInterval={2000}/>,
  document.getElementById('content')
);
