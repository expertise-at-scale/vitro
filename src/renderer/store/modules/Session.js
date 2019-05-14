const state = {
    confluency: 80,
    passageNum: 33,
    splitDilution: '1:6',
    initials: 'JC',
    name: null,
    startingStep: null,
};

const mutations = {
	SET_CONFLUENCY(state, confluency) {
		state.confluency = confluency;
    },
    SET_PASSAGE_NUM(state, passageNum) {
        state.passageNum = passageNum;
    },
    SET_NAME(state, name) {
        state.name = name;
        // const initials = name.match(/\b\w/g) || [];
        state.initials = name; // anonymized for study purposes. otherwise: ((initials.shift() || '') + (initials.pop() || '')).toUpperCase()
    },
    SET_STARTING_STEP(state, stepNum) {
        state.startingStep = stepNum;
    },
};

export default {
    state,
	mutations,
};
