import argparse
import sys
import random


def generate(path, count, inject_evil):
	outputfile = open(path, 'w')
	curcount = 0
	points = []
	while curcount < count:
		if inject_evil and random.randint(1, 5) == 5:
			choice = random.randint(1, 3)
			if choice == 1:
				randline = ''.join([random.choice('0123456789 aZ.') for i in xrange(8)])
				outputfile.write(randline + '\n')
			elif choice == 2:
				x = random.choice([random.randint(-7000, -5001), random.randint(3000, 8000)])
				y = random.randint(5001, 10000)
				outputfile.write('%d %d\n' % (x, y))
			else:
				repeating_point = random.choice(points)
				outputfile.write('%d %d\n' % (repeating_point[0], repeating_point[1]))
			curcount+=1
		else:
			x = random.randint(-5000, 5000)
			y = random.randint(-5000, 5000)
			if [x, y] not in points:
				outputfile.write('%d %d\n' % (x, y))
				points.append([x, y])
				curcount+=1
	outputfile.close()


if __name__ == "__main__":
	parser = argparse.ArgumentParser(description="Generates coord text file")
	parser.add_argument('filepath', help="path to output file")
	parser.add_argument('count', type=int, help="number of coordinates to generate")
	parser.add_argument('--inject-evil', help="randomly generate out of-bounds or garbled data", action='store_true')

	args = parser.parse_args()
	if args.count < 0 or args.count > 20000:
		raise Exception("Count should be between 0 and 20000")
		sys.exit(1)
	generate(args.filepath, args.count, args.inject_evil)