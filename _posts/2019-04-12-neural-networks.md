---
author: maximbircu
layout: post
comments: true
image: assets/images/posts/neural-networks/neural-networks.jpg
---
Have you ever used something without fully understanding how it actually works? **You're not alone!**... This post aims to demystify a bit the processes going under a neural network model and explain to you how a neural network is composed internally.

## Motivation
When I just started getting familiar with neural nets I was reading hundreds of articles which were full of math starting from simple operations with matrices and finishing with partial derivatives and complex functions.

<img src="{{ site.baseUrl }}/assets/images/posts/neural-networks/bored.gif" class="centered">

Yeh, and probably an interesting question is how I didn't get bored while reading all this theoretical stuff well, the answer is very simple

> "I get very, very, very bored!" :dissapointed:

But still, after a huge number of complex math articles and white nights, I didn't have a complete understanding of what a Neural Net model really is.

Now I have a way more clear vision about how all this stuff works and writing this post hoping that it will help to make the things more clear for you also.

## Where to Start?

Well, the first thing that I figured out is that Neural Network most probably is not the best name for a mathematical model because it’s already reserved for the real biological neural nets from human beings brains and would be way more correct to call it Artificial Neural Network or ANN instead. 

So knowing this it’s already clear that Artificial Neural Network(ANN) is nothing else than a mathematical model of a real biological Neural Network. 

And here I finally released that I was trying to learn how to build a math model of something that I didn’t really know how it works at that time. And that something was nothing else than the human brain from the biological point of view.

Yes, you got me right! And probably it sounds obvious but would be way easier to build a math model of a Neural Net when you know how it works :D

That's why I decided to study a bit the Neural Nets from the biological point of view first and than came back to math.

## Real Neural Networks
And here I want to congratulate you being one of the least people that was not scared with biology and continued to read the post. Hurry to let you know that we’ll not dive too deep in biology stuff but still, you should remember at least the high school biology classes knowledge.
So let’s get started.

So the role of a biological neural net talking simply is to take some information in the form of some electrical signals and generate an output by propagating those signals through its neurons. Yeah, to understand how this process happens we need to see how the neuron works.
 
So basically a neuron, also known as a nerve cell is an electrically excitable cell that receives, processes, and transmits information through electrical and chemical signals and which is composed of 4 main parts:  

1. Dendritic tree
1. Cell body 
1. Axon
1. Synaps

<img src="{{ site.baseUrl }}/assets/images/posts/neural-networks/neural-cell.png">

 So talking simply the neuron receives some signals through some of its dendrites from other neurons which are being collected, summed up and which travels to the hillock and in case it’s large enough it will trigger an action potential on the axon which will cause the signal to travel down the bounds of the axon right to the next neuron.

Yeah, and probably you already got that neurons are connected to each other into a network, and probably one of the most interesting parts in a neuron is that connection called synapse, so let’s see how it looks and what it does.

So a neuron becomes connected to another neuron when at least one of its axonal terminations is extremely close to one of the dendrites of that neuron and forms a Synapse which is a small biological junction through each neuron signals can be sent to each other.

<img src="{{ site.baseUrl }}/assets/images/posts/neural-networks/connected-neurons.png">

What’s interesting is that they are extremely close, but not touching each other. There is a small space between the membranes of both cells called Synaptic cleft as shown in the picture below.

`<picture with synaps>`

So when we have 2 neurons connected to each other through a synapse and the first neurons fires which means that there was enough accumulated signal at its hillock the voltage potential across the membrane is positive enough to trigger some sodium channels close to axonal terminals which allows a fluid of sodium to come inside the cell which triggers another Ca++ channel allows Ca++ flow inside the axonal termination.

`<picture of synapse with Ca++>`

Most probably you know that in any axonal termination there are some vesicles which act as kind of containers for some molecules called neurotransmitters(serotonin, dopamine, epinephrine) and which are docked to the presynaptic neuron’s membrane by some special proteins which actually are called SNARE proteins.

`<picture of synapse with neurotransmitters vesicles>`

And when Ca++ ions get inside the axonal termination it changes the confirmation of the SNARE proteins enough to make the proteins bring the vesicles with neurotransmitters as close as possible to the membrane such as in the end their membranes merge and al neurotransmitters are dumped into the synaptic cleft as shown in the picture below.

`<picture with exocitose>`

By the way, this process is called exocytosis, and when this happens all these neurotransmitters being in synaptic cleft they bound to the membrane of the postsynaptic neuron which can trigger the sodium channels to be opened and this way the dendrite of the postsynaptic neuron will be excited, and most probably if some other dendrites of this neuron will be excited the same way  by some other neurons and the cell will accumulate enough positive potential the neuron will fair.

## Artificial Neural Network

Glad to see you reached this part of this post, we are going to do some math soon but before we start as we are going to model mathematically the stuff that we talked about above let’s try to do a short recap and take a look at the steps through which one neuron will pass a signal to another neuron: 

1. The neuron will receive some signals through Synapses from other neurons. to some of its dendrites
1. All these signals will be accumulated and summed up in its cell.
1. If the accumulated potential reaches a specific bound a spike or a signal will go through the axon right forward to the axonal terminations to be passed to the next neuron or be consumed by some other cells which could be for example muscle cells.

So basically now to model the neuron mathematically we need to model these 3 steps mentioned above.

But first, the neuron should receive some signals which we are going to represent as variables from x1 to xn and for simplicity let’s assume that they will take values from 0..1 range.


<img src="{{ site.baseUrl }}/assets/images/posts/neural-networks/neural-model-step0.png">

### Step 1

All signals mentioned above should pass through synapses which will increase or decrease their influence. Well talking about math most probably this could be represented by multiplication. So we are going to multiply our signals by some sort of weights w. Which will become our headache in the training phase, but will talk about this a bit later.

<img src="{{ site.baseUrl }}/assets/images/posts/neural-networks/neural-model-step1.png">

### Step 2

I would say that this is the most obvious step as we need to model the cumulative effect of the signal and I guess that is already clear that we’re going to do this by adding a sum operator :)

<img src="{{ site.baseUrl }}/assets/images/posts/neural-networks/neural-model-step2.png">

### Step 3

And in the last step, we need to model somehow the effect of the fairing at some point when there is enough signal accumulated. Well not sure how it is but we can do this by introducing a simple step function.

<img src="{{ site.baseUrl }}/assets/images/posts/neural-networks/neural-model-step3.png">
