package com.hamza.websockets;

import com.hamza.websockets.data.HelloMessage;
import com.hamza.websockets.data.Message;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.util.HtmlUtils;

@Controller
@Slf4j
public class GreetingController {

    @MessageMapping("/message")
    @SendTo("/topic/greetings")
    public Message greeting(HelloMessage message) throws Exception {
        log.info("Received message: {}", message.getName());
        Thread.sleep(100);
        Message responseMessage = new Message(HtmlUtils.htmlEscape(message.getName()));
        log.info("Sending response message: {}", responseMessage);
        return responseMessage;
    }

}
