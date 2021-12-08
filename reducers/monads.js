// Hold a list of items
class ListMonad {
	constructor(
		{
			values = [],
		} = {},
	) {
		this.values = values;
	}

	static empty () {
		return EMPTY_ListMonad;
	}

	concat(b) {
		if (this === b) {
			return this;
		}
		return new ListMonad({
			values: [...this.values, ...b.values],
		});
	}
}
EMPTY_ListMonad = new ListMonad();

module.exports.ListMonad = ListMonad;
