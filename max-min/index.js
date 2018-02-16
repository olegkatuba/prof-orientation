class MaxMin {
	static cluster(array) {
		let m = this.indexOfMax(array);
		array = array.map((item, index) => ({id: index, val: item}));
		let clusters = [];
		clusters.push(new Cluster(array[m]));
		let distances = [];
		this.updateDistances(distances, clusters, array);
		clusters.push(new Cluster(array[this.indexOfMax(distances[0])]));
		let T;
		do{
			T = this.calcT(clusters);
			this.updateDistances(distances, clusters, array);
			this.updateClusters(clusters, distances, array);

		} while (!this.isFinish(clusters, T));

		return clusters.map(cluster => cluster.items.sort((a, b) => b.val - a.val).map(item => item.id));
	}

	static calcT(clusters) {
		let sum = 0;
		let k = clusters.length;
		for (let i = 0; i < k - 1; i++) {
			for (let j = i + 1; j < k; j++) {
				sum += this.evclidDist(clusters[i].p, clusters[j].p)
			}
		}
		return sum / (k * (k - 1));
	}

	static isFinish(clusters, T) {
		let finish = true;
		clusters.forEach(cluster => {
			let y = cluster.items[this.indexOfMax(cluster.items.map(i => this.evclidDist(i, cluster.p)))];
			if (this.evclidDist(cluster.p, y) >= T) {
				clusters.push(new Cluster(y));
				finish = false;
			}
		});
		return finish;
	}

	static updateClusters(clusters, distances, array) {
		for (let i = 0; i < clusters.length; i++) {
			clusters[i].clear();
		}
		for (let i = 0; i < distances[0].length; i++) {
			let arr = [];
			for (let j = 0; j < distances.length; j++) {
				arr.push(distances[j][i]);
			}
			clusters[this.indexOfMin(arr)].items.push(array[i]);
		}
	}

	static updateDistances(distances, clusters, array) {
		//return clusters.map(cluster => array.map(i => this.evclidDist(cluster.p, i)));
		distances.length = 0;
		clusters.forEach(cluster => distances.push(array.map(i => this.evclidDist(cluster.p, i))));
	}

	static evclidDist(a, b) {
		return Math.abs(a.val - b.val);
	}

	static max(array) {
		return array.reduce((max, current) => {
			return (current.val > max.val ? current : max)
		});
	}

	static indexOfMax(array) {
		return array.reduce((indexOfMax, current, index, arr) => {
			return (current > arr[indexOfMax] ? index : indexOfMax)
		}, 0);
	}

	static indexOfMin(array) {
		return array.reduce((indexOfMin, current, index, arr) => {
			return (current < arr[indexOfMin] ? index : indexOfMin)
		}, 0);
	}
}

class Cluster {
	constructor(prototype) {
		this.p = prototype;
		this.items = [this.p];
	}

	clear() {
		this.items = [];
	}
}

module.exports = MaxMin;