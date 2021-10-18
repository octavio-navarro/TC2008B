"""
Hello World app for running Python apps on Bluemix
"""

# Always prefer setuptools over distutils
from setuptools import setup, find_packages
# To use a consistent encoding
from codecs import open
from os import path

here = path.abspath(path.dirname(__file__))

setup(
    name='boids-example',
    version='1.0.0',
    description='Example of a connection of IBM cloud with Unity',
    url='https://github.com/octavio-navarro/TC2008B',
    license='MIT'
)
