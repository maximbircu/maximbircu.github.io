---
author: maximbircu
layout: post
comments: true
image: assets/images/posts/friday-inside-github/cover.png
title: Friday Inside GitHub? 🤔
excerpt: "I've been using Friday for more than a year now, and I can't imagine my work without it. But even though it helps a lot, there is always stuff that could be automated."
---

Not so long ago, I wrote a post describing how I developed Friday, a CLI(Command Line Interface) tool that helps me with recurrent daily tasks and frees up some time for more valuable and exciting things. You can check it out here [https://www.maximbircu.com/2021/02/27/friday.html](https://www.maximbircu.com/2021/02/27/friday.html).

I've been using Friday for more than a year now, and I can't imagine my work without it. But even though it helps a lot, there is always stuff that could be automated.

Being responsible for pull requests merging in my team and doing it for a long time, I noticed that I spent up to 1 minute on this task multiple times a day. This is because we have conventions for the pull request merge commit messages, and I had to manually build them using different parts of the pull request description and title.

Thus I thought, what if I could delegate this task to Friday? 🤔

And yeah, after a bit of research and a weekend of coding, the new feature is unlocked! 🎉 [https://github.com/maximbircu/pull-request-assistant](https://github.com/maximbircu/pull-request-assistant)

## How I did it?

First of all, I had to make Friday run inside GitHub. As I was already familiar with GitHub Actions, it was clear from the beginning that I was going to develop a new custom GitHub Action.

The second question I had to solve was about the CLI, where I would write commands for Friday in the future. And actually, the inquiry was not about the CLI, but more about its absence in GitHub web UI. 😃 The solution was pretty straightforward. We can use the GitHub pull request feed as a CLI and write our commands as comments to the pull request. Then intercept them inside the GitHub Action and process them.

The next step was finding a library that would simplify the process of making the GitHub Action act like a CLI tool and generate lovely help messages. After researching through the millions of NPM libraries, I decided to use [https://www.npmjs.com/package/commander](https://www.npmjs.com/package/commander).

Finally, after clarifying these three questions, I was ready to proceed to the actual development. With a bit of Java Script magic, Oktokit APIs, and regular expressions, I got the desired result. My Friday Github Action was up and running. 🎉

<img alt="It's Alive!" style="width:50%;" src="{{ site.baseUrl }}/assets/images/posts/friday-inside-github/it_is_alive.gif" />

Of course, I will not explain every line of code here as this might be tedious, but you can go and check it yourself [here](https://github.com/maximbircu/pull-request-assistant).

## How to use it?

So, to start using pull request assistant, you only have to add its workflow YML file into your repository.

```yaml
name: Friday

on:
  issue_comment:
    types: [ created ]
  pull_request_review:
    types:
      - submitted
  check_suite:
    types:
      - completed

jobs:
  friday:
    runs-on: ubuntu-latest
    env:
      GITHUB_TOKEN: ${{ secrets.ACCESS_TOKEN }}
    steps:
      - name: SCM
        uses: actions/checkout@v2

      - name: Run assistant
        uses: maximbircu/pull-request-assistant@1.0.0

        env:
          GITHUB_TOKEN: "${{ secrets.GITHUB_TOKEN }}"
```

Now, go to any of your pull requests and type the first command as a comment.

<img alt="It's Alive!" src="{{ site.baseUrl }}/assets/images/posts/friday-inside-github/running_help_command.png" />

In short, the command will be executed, and you'll get this.

<img alt="It's Alive!" src="{{ site.baseUrl }}/assets/images/posts/friday-inside-github/help_command_output.png" />

Note that Friday will execute just one command at a time, and if you quickly add two comments, only the last one will be performed, while the other ones will be canceled. I did this for simplicity.

For now, Friday GitHub Action has just one single command, merge, which is very customizable. You can check out the complete documentation for more details https://github.com/maximbircu/pull-request-assistant/blob/master/documentation/documentation.md.

I plan on adding more commands in the future whenever I'll find any other work that could be automated, and I would be happy to your contributions to this little tool as well.