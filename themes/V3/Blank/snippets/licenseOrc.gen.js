/* eslint-disable max-lines */
const _ = require('lodash');
const dedent = require('dedent');

module.exports = {

orc1 : function () {
		return dedent`
        {{license,wide,orc
        | | |
        |-|-|
        |ORC Notice|This product is licensed under the ORC License located at the Library of Congress at TX 9-307-067 and available online at various locations including [possible domain names may be inserted] and others. All warranties are disclaimed as set forth therein.
        |Attribution|This product is based on the following Licensed Material:
        |^|[Title of Work], [Copyright Notice], [Author Credit Information].^|
        |^|[Title of Additional Work], [Copyright Notice], [Author Credit Information], [Etc.].^|
        |^|If you use our Licensed Material in your own published works, please credit us as follows:^|
        |^|[Title of This Work], [Copyright Notice], [Your Author Credit Information].^|
        |Reserved Material|Reserved Material elements in this product include, but may not be limited to: 
        |Expressly Designated Licensed|Material	The following elements are owned by the Licensor and would otherwise constitute Reserved Material and are hereby designated as Licensed Material:|
        }}
        `;
	},
};