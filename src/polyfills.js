// This file provides polyfills for Node.js core modules in the browser
import process from 'process';
import { Buffer } from 'buffer';

window.process = process;
window.Buffer = Buffer;

