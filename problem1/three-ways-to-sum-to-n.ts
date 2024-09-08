// Assuming n >= 1

const sumToN1 = (n: number): number => {
  let sum = 0;

  for (let i = 1; i <= n; i++) {
    sum += i;
  }

  return sum;
};

const sumToN2 = (n: number): number => {
  // If n is even, the result is equal to the sum of (a[0] + a[n]) multiplied by half of n
  // If n is odd, the result is equal to the sum of (a[0] + a[n]) multiplied by half of (n - 1), plus middle element: a[n / 2]

  if (n % 2 === 0) {
    return (n + 1) * (n / 2);
  } else {
    return (n + 1) * ((n - 1) / 2) + (n + 1) / 2;
  }
};

const sumToN3 = (n: number): number => {
  // This is an arithmetic sequence, we already know the first and the last number in the sequence:
  // Formula: S(n) = (n/2) * (a[1] + a[n])

  return (n / 2) * (n + 1);
};

const sumToN4 = (n: number): number => {
  // Recursive

  if (n === 1) {
    return 1;
  }

  return n + sumToN4(n - 1);
};
