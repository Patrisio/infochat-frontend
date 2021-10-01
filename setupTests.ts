import enzyme from 'enzyme';
const Adapter = require('@wojtekmaj/enzyme-adapter-react-17');
enzyme.configure({ adapter: new Adapter() });