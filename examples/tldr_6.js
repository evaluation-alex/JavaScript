// Base 64 character 256 bit token

import {Random, Entropy, charSet64} from './entropy-string'

const random = new Random(charSet64)

const string = random.token()

console.log('\n  256 bit token using RFC 4648 URL and file system safe characters: ' + string + '\n')
